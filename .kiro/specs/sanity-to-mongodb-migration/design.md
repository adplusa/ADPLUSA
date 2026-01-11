# Design Document: Sanity to MongoDB Migration

## Overview

This design outlines the architecture for migrating from Sanity CMS to a MongoDB-based content management system with a custom React admin interface. The solution consists of three main components: a MongoDB database with Mongoose schemas, a Node.js/Express REST API, and a React admin dashboard. The existing Next.js frontend will be updated to consume the new API instead of Sanity's client.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  - Public website pages                                      │
│  - Fetches content via REST API                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTP/HTTPS
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   API Layer (Express.js)                     │
│  - REST endpoints for content                                │
│  - Authentication middleware                                 │
│  - Image upload handling                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Mongoose ODM
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   MongoDB Database                           │
│  - Content collections (projects, services, etc.)            │
│  - User authentication data                                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              React Admin Interface                           │
│  - Content management dashboard                              │
│  - Communicates with API Layer                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              Image Storage (Cloudinary/S3/Local)             │
│  - Stores uploaded images                                    │
│  - Serves optimized images                                   │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Node.js with Express.js for API server
- MongoDB for database
- Mongoose for ODM (Object Data Modeling)
- JWT for authentication
- Multer for file uploads
- Cloudinary or AWS S3 for image storage (or local filesystem for development)

**Admin Interface:**
- React 18+ with functional components and hooks
- React Router for navigation
- Axios for API calls
- React Hook Form for form management
- TailwindCSS for styling
- React Quill or TinyMCE for rich text editing

**Frontend (Existing Next.js):**
- Minimal changes - replace Sanity client with fetch/axios calls
- Keep existing UI components and styling

## Components and Interfaces

### 1. MongoDB Schemas (Mongoose Models)

#### Base Schema Fields
All content types will include these common fields:
```javascript
{
  _id: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  seoTitle: String,
  seoDescription: String
}
```

#### Project Schema
```javascript
{
  title: String (required),
  slug: String (required, unique, indexed),
  description: String,
  images: [{
    url: String,
    alt: String,
    width: Number,
    height: Number
  }],
  category: String,
  featured: Boolean,
  link: String,
  seoTitle: String,
  seoDescription: String
}
```

#### Service Schema
```javascript
{
  title: String (required),
  slug: String (required, unique, indexed),
  description: String,
  content: String (rich text),
  bannerImage: {
    url: String,
    darkModeUrl: String
  },
  features: [{
    title: String,
    description: String
  }],
  image: {
    url: String,
    darkModeUrl: String
  },
  seoTitle: String,
  seoDescription: String
}
```

#### FAQ Schema
```javascript
{
  title: String,
  categories: [{
    title: String,
    description: String,
    chatLink: String,
    image: {
      url: String,
      darkModeUrl: String
    },
    faqs: [{
      question: String,
      answer: String
    }]
  }],
  seoTitle: String,
  seoDescription: String
}
```

#### About Page Schema
```javascript
{
  allowLightHeading: String,
  allowUsHeading: String,
  allowRightHeading: String,
  paragraph: String (rich text),
  anchorLinks: [{
    label: String,
    targetId: String
  }],
  sections: [{
    sectionId: String,
    title: String,
    body: String,
    image: {
      url: String,
      darkModeUrl: String
    }
  }],
  seoTitle: String,
  seoDescription: String
}
```

#### User Schema (for admin authentication)
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'editor']),
  lastLogin: Date
}
```

### 2. REST API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/login          - Login and receive JWT token
POST   /api/auth/register       - Register new admin user (protected)
POST   /api/auth/logout         - Logout (invalidate token)
GET    /api/auth/me             - Get current user info
```

#### Content Endpoints (Public - Read Only)
```
GET    /api/projects            - List all projects (with pagination)
GET    /api/projects/:slug      - Get single project by slug
GET    /api/services            - List all services
GET    /api/services/:slug      - Get single service by slug
GET    /api/faq                 - Get FAQ data
GET    /api/about               - Get about page data
GET    /api/contact             - Get contact page data
```

#### Admin Content Endpoints (Protected - Requires JWT)
```
POST   /api/admin/projects      - Create new project
PUT    /api/admin/projects/:id  - Update project
DELETE /api/admin/projects/:id  - Delete project

POST   /api/admin/services      - Create new service
PUT    /api/admin/services/:id  - Update service
DELETE /api/admin/services/:id  - Delete service

PUT    /api/admin/faq           - Update FAQ data
PUT    /api/admin/about         - Update about page
PUT    /api/admin/contact       - Update contact page
```

#### Image Upload Endpoints (Protected)
```
POST   /api/admin/upload        - Upload single image
POST   /api/admin/upload/multiple - Upload multiple images
DELETE /api/admin/images/:id    - Delete image
```

### 3. API Middleware

#### Authentication Middleware
```javascript
function authenticateToken(req, res, next) {
  // Extract JWT from Authorization header
  // Verify token validity
  // Attach user info to req.user
  // Call next() or return 401
}
```

#### Error Handling Middleware
```javascript
function errorHandler(err, req, res, next) {
  // Log error
  // Return appropriate status code and message
  // Hide sensitive details in production
}
```

#### File Upload Middleware
```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Accept only images
  }
});
```

### 4. React Admin Interface Structure

#### Component Hierarchy
```
App
├── AuthProvider (Context for authentication)
├── Router
    ├── Login
    ├── Dashboard (Protected Route)
    │   ├── Sidebar (Navigation)
    │   ├── ContentList (Reusable)
    │   │   ├── ProjectList
    │   │   ├── ServiceList
    │   │   └── ...
    │   ├── ContentForm (Reusable)
    │   │   ├── ProjectForm
    │   │   ├── ServiceForm
    │   │   └── ...
    │   └── ImageUploader (Reusable)
    └── NotFound
```

#### Key Components

**AuthProvider**
- Manages authentication state
- Stores JWT token in localStorage
- Provides login/logout functions
- Protects routes

**ContentList**
- Displays paginated list of content items
- Supports search and filtering
- Shows key fields in table format
- Provides edit and delete actions

**ContentForm**
- Dynamic form based on content type
- Handles validation
- Supports rich text editing
- Includes image upload
- Shows save/cancel buttons

**ImageUploader**
- Drag-and-drop interface
- Image preview
- Progress indicator
- Supports multiple uploads

### 5. Frontend Integration Changes

#### Replace Sanity Client
```javascript
// OLD (Sanity)
import { client } from "@/sanity/lib/client";
const data = await client.fetch('*[_type == "projectPage"]');

// NEW (REST API)
const response = await fetch('/api/projects');
const data = await response.json();
```

#### Replace Image URLs
```javascript
// OLD (Sanity)
import urlFor from "../helpers/sanity";
const imageUrl = urlFor(image).url();

// NEW (Direct URL)
const imageUrl = image.url; // Already a full URL from storage
```

#### Update Data Fetching Pattern
```javascript
// Use Next.js API routes or direct fetch
export async function getStaticProps() {
  const res = await fetch(`${process.env.API_URL}/api/projects`);
  const projects = await res.json();
  
  return {
    props: { projects },
    revalidate: 60 // ISR
  };
}
```

## Data Models

### Image Storage Model

Images will be stored in Cloudinary (or S3) with the following structure:

```javascript
{
  publicId: "projects/project-1/hero-image",
  url: "https://res.cloudinary.com/.../image.jpg",
  secureUrl: "https://res.cloudinary.com/.../image.jpg",
  format: "jpg",
  width: 1920,
  height: 1080,
  bytes: 245678,
  createdAt: Date
}
```

### Migration Data Mapping

The migration script will transform Sanity data to MongoDB format:

**Sanity Image Reference → MongoDB Image Object**
```javascript
// Sanity format
{
  _type: "image",
  asset: {
    _ref: "image-abc123-1920x1080-jpg"
  }
}

// MongoDB format
{
  url: "https://storage.example.com/images/abc123.jpg",
  alt: "Project image",
  width: 1920,
  height: 1080
}
```

**Sanity Portable Text → HTML String**
```javascript
// Sanity format
[
  {
    _type: "block",
    children: [{ text: "Hello world" }]
  }
]

// MongoDB format (converted to HTML)
"<p>Hello world</p>"
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: API Authentication Consistency
*For any* protected API endpoint, when a request is made without a valid JWT token, the API should return a 401 Unauthorized status code and not execute the requested operation.

**Validates: Requirements 4.2, 4.3**

### Property 2: Content CRUD Round Trip
*For any* content type (project, service, FAQ, etc.), creating an item via the admin API and then fetching it via the public API should return data equivalent to what was created.

**Validates: Requirements 3.1, 3.2, 6.8, 9.2**

### Property 3: Image Upload and Retrieval
*For any* valid image file uploaded through the admin interface, the system should store it successfully and return a publicly accessible URL that serves the image.

**Validates: Requirements 2.1, 2.2, 2.5**

### Property 4: Form Validation Consistency
*For any* content form in the admin interface, when required fields are missing, the form should prevent submission and display appropriate error messages for each missing field.

**Validates: Requirements 6.6, 6.7**

### Property 5: Migration Data Preservation
*For any* content item in Sanity, after running the migration script, an equivalent item should exist in MongoDB with all fields correctly transformed.

**Validates: Requirements 8.2, 8.3, 8.5**

### Property 6: SEO Metadata Propagation
*For any* content item with SEO metadata, when the frontend fetches that content, the API response should include the SEO title and description fields.

**Validates: Requirements 10.2, 10.3**

### Property 7: Image Deletion Cascade
*For any* content item that is deleted, all associated images should also be removed from the storage system.

**Validates: Requirements 7.4**

### Property 8: Token Expiration Enforcement
*For any* expired JWT token, when used to access a protected endpoint, the API should reject the request with a 401 status code.

**Validates: Requirements 4.4**

## Error Handling

### API Error Responses

All API errors will follow a consistent format:
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human-readable error message",
    details: {} // Optional additional context
  }
}
```

### Error Categories

**Authentication Errors (401)**
- Invalid credentials
- Missing token
- Expired token
- Invalid token signature

**Authorization Errors (403)**
- Insufficient permissions
- Account disabled

**Validation Errors (400)**
- Missing required fields
- Invalid field format
- Duplicate unique fields (slug, email)

**Not Found Errors (404)**
- Content item not found
- Route not found

**Server Errors (500)**
- Database connection failure
- External service failure (image storage)
- Unexpected errors

### Frontend Error Handling

**Admin Interface:**
- Display toast notifications for errors
- Show inline validation errors on forms
- Redirect to login on 401 errors
- Show retry button for network errors

**Public Frontend:**
- Show fallback content on API errors
- Log errors for monitoring
- Graceful degradation (show cached data if available)

## Testing Strategy

### Unit Tests

**Backend:**
- Test each Mongoose model validation
- Test authentication middleware with valid/invalid tokens
- Test API route handlers with mocked database
- Test image upload utility functions
- Test data transformation functions for migration

**Admin Interface:**
- Test form validation logic
- Test authentication context provider
- Test API service functions
- Test image uploader component

**Frontend:**
- Test data fetching functions
- Test error handling in components

### Property-Based Tests

Each correctness property will be implemented as a property-based test using a testing library appropriate for the language:

**Backend (Node.js):** Use `fast-check` library
- Minimum 100 iterations per test
- Generate random content data, tokens, and API requests
- Verify properties hold across all generated inputs

**Admin Interface (React):** Use `@fast-check/jest` or similar
- Generate random form inputs
- Verify validation behavior
- Test component rendering with various data

### Integration Tests

- Test complete API workflows (create → read → update → delete)
- Test authentication flow (login → access protected route → logout)
- Test image upload → storage → retrieval flow
- Test migration script with sample Sanity data

### End-to-End Tests

- Test admin interface workflows using Playwright or Cypress
- Test frontend content display after API integration
- Test complete user journey: login → create content → view on frontend

### Migration Testing

- Create test Sanity dataset
- Run migration script
- Verify all content transferred correctly
- Compare field-by-field between Sanity and MongoDB
- Verify all images downloaded and re-uploaded

## Deployment Considerations

### Environment Variables

```
# Database
MONGODB_URI=mongodb://localhost:27017/architect-cms
MONGODB_URI_PROD=mongodb+srv://user:pass@cluster.mongodb.net/architect-cms

# API
API_PORT=5000
API_URL=http://localhost:5000
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Or AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1

# Sanity (for migration only)
SANITY_PROJECT_ID=5ippxm43
SANITY_DATASET=production
SANITY_API_TOKEN=your-read-token

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Deployment Steps

1. **Database Setup:**
   - Create MongoDB Atlas cluster or self-hosted instance
   - Configure network access and authentication
   - Create database user with appropriate permissions

2. **API Deployment:**
   - Deploy Express API to hosting service (Vercel, Railway, Heroku, AWS)
   - Set environment variables
   - Ensure MongoDB connection works
   - Test API endpoints

3. **Image Storage Setup:**
   - Create Cloudinary account or S3 bucket
   - Configure upload presets and transformations
   - Set environment variables

4. **Admin Interface Deployment:**
   - Build React app for production
   - Deploy to static hosting (Vercel, Netlify, S3)
   - Configure API URL environment variable

5. **Frontend Update:**
   - Update Next.js app to use new API
   - Test all pages locally
   - Deploy updated frontend

6. **Migration Execution:**
   - Run migration script in staging environment first
   - Verify data integrity
   - Run in production
   - Keep Sanity data as backup for 30 days

### Monitoring and Maintenance

- Set up error logging (Sentry, LogRocket)
- Monitor API performance and response times
- Set up database backups (daily automated backups)
- Monitor image storage usage and costs
- Set up uptime monitoring for API and frontend
