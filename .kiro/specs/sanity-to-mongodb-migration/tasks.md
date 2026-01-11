# Implementation Plan: Sanity to MongoDB Migration

## Overview

This implementation plan breaks down the migration from Sanity CMS to MongoDB with a custom React admin interface into discrete, manageable tasks. The approach follows an incremental strategy: set up infrastructure first, build the API layer, create the admin interface, migrate data, and finally update the frontend.

## Tasks

- [-] 1. Project setup and infrastructure
  - Create new directory structure for backend API
  - Initialize Node.js project with TypeScript configuration
  - Install core dependencies (Express, Mongoose, JWT, Multer, AWS SDK)
  - Set up environment variable configuration with dotenv
  - Create basic Express server with health check endpoint
  - _Requirements: 12.1, 12.2_

- [ ] 2. MongoDB database setup and schemas
  - [ ] 2.1 Configure MongoDB connection with Mongoose
    - Create database connection module with connection pooling
    - Add connection error handling and retry logic
    - _Requirements: 1.1_

  - [ ] 2.2 Create Mongoose schemas for all content types
    - Define base schema with common fields (timestamps, SEO)
    - Create Project schema with image arrays and slug indexing
    - Create Service schema with features and banner images
    - Create FAQ schema with nested categories and questions
    - Create About Page schema with sections and anchor links
    - Create Contact Page schema
    - Create User schema for authentication with password hashing
    - Add unique indexes on slug fields
    - _Requirements: 1.2, 1.3, 1.5_

  - [ ]* 2.3 Write property test for schema validation
    - **Property 2: Content CRUD Round Trip**
    - **Validates: Requirements 3.1, 3.2, 6.8, 9.2**

- [ ] 3. Authentication system implementation
  - [ ] 3.1 Implement user registration and password hashing
    - Create user registration endpoint with bcrypt hashing
    - Add validation for username and email uniqueness
    - _Requirements: 4.5_

  - [ ] 3.2 Implement JWT token generation and login
    - Create login endpoint that validates credentials
    - Generate JWT tokens with expiration
    - Return token and user info on successful login
    - _Requirements: 4.1, 4.2_

  - [ ] 3.3 Create authentication middleware
    - Extract and verify JWT from Authorization header
    - Attach user info to request object
    - Handle token expiration and invalid tokens
    - _Requirements: 4.3, 4.4_

  - [ ]* 3.4 Write property test for authentication
    - **Property 1: API Authentication Consistency**
    - **Validates: Requirements 4.2, 4.3**

  - [ ]* 3.5 Write property test for token expiration
    - **Property 8: Token Expiration Enforcement**
    - **Validates: Requirements 4.4**

  - [ ]* 3.6 Write unit tests for authentication
    - Test password hashing and comparison
    - Test JWT generation and verification
    - Test authentication middleware with various token states
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 3.7 Implement rate limiting on login endpoint
    - Add express-rate-limit middleware to login route
    - Configure 5 attempts per 15 minutes per IP
    - _Requirements: 4.6_

- [ ] 4. Checkpoint - Ensure authentication tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Image storage setup
  - [ ] 5.1 Configure AWS S3 integration
    - Set up AWS SDK with credentials from environment variables
    - Create S3 client instance with proper configuration
    - Create upload utility function with multipart upload support
    - Implement image optimization (resize, compress) before upload
    - Configure bucket CORS for admin interface uploads
    - _Requirements: 2.2, 2.3_

  - [ ] 5.2 Create image upload endpoint
    - Add Multer middleware for multipart form data
    - Implement single and multiple image upload routes
    - Upload images to S3 with organized folder structure
    - Generate and return S3 URLs (and CloudFront URLs if configured)
    - Add file size and type validation
    - Store image metadata in MongoDB
    - _Requirements: 2.1, 2.5_

  - [ ] 5.3 Create image deletion endpoint
    - Implement endpoint to delete images from S3 bucket
    - Remove image metadata from MongoDB
    - Add authentication check
    - _Requirements: 2.4_

  - [ ]* 5.4 Write property test for image upload
    - **Property 3: Image Upload and Retrieval**
    - **Validates: Requirements 2.1, 2.2, 2.5**

  - [ ]* 5.5 Write unit tests for image operations
    - Test image upload with valid files
    - Test upload rejection for invalid file types
    - Test file size limit enforcement
    - Test S3 upload and URL generation
    - Test image deletion from S3
    - _Requirements: 2.1, 2.2, 2.4, 2.6_

- [ ] 6. Public API endpoints (read-only)
  - [ ] 6.1 Create GET endpoints for projects
    - Implement /api/projects with pagination and filtering
    - Implement /api/projects/:slug for single project
    - Add error handling for not found cases
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ] 6.2 Create GET endpoints for services
    - Implement /api/services list endpoint
    - Implement /api/services/:slug for single service
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 6.3 Create GET endpoints for other content types
    - Implement /api/faq endpoint
    - Implement /api/about endpoint
    - Implement /api/contact endpoint
    - _Requirements: 3.1, 3.2_

  - [ ] 6.4 Add CORS configuration
    - Configure CORS middleware for frontend domain
    - Allow credentials for authenticated requests
    - _Requirements: 3.6_

  - [ ] 6.5 Implement population of related data
    - Ensure image objects are fully populated in responses
    - Handle nested data structures correctly
    - _Requirements: 3.7_

  - [ ]* 6.6 Write unit tests for public API endpoints
    - Test pagination and filtering
    - Test single item retrieval
    - Test 404 responses for missing content
    - Test CORS headers
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6_

- [ ] 7. Admin API endpoints (protected)
  - [ ] 7.1 Create admin endpoints for projects
    - Implement POST /api/admin/projects (create)
    - Implement PUT /api/admin/projects/:id (update)
    - Implement DELETE /api/admin/projects/:id (delete)
    - Add authentication middleware to all routes
    - Add validation for required fields
    - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.8_

  - [ ] 7.2 Create admin endpoints for services
    - Implement POST /api/admin/services (create)
    - Implement PUT /api/admin/services/:id (update)
    - Implement DELETE /api/admin/services/:id (delete)
    - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.8_

  - [ ] 7.3 Create admin endpoints for other content types
    - Implement PUT /api/admin/faq
    - Implement PUT /api/admin/about
    - Implement PUT /api/admin/contact
    - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.8_

  - [ ] 7.4 Implement image deletion cascade
    - When content is deleted, remove associated images
    - Add cleanup function for orphaned images
    - _Requirements: 7.4_

  - [ ]* 7.5 Write property test for image deletion cascade
    - **Property 7: Image Deletion Cascade**
    - **Validates: Requirements 7.4**

  - [ ]* 7.6 Write unit tests for admin endpoints
    - Test create, update, delete operations
    - Test validation error responses
    - Test authentication requirement
    - Test image cascade deletion
    - _Requirements: 6.1, 6.2, 6.3, 6.6, 6.8, 7.4_

- [ ] 8. Error handling and validation
  - [ ] 8.1 Create global error handler middleware
    - Implement consistent error response format
    - Handle different error types (validation, auth, not found, server)
    - Log errors appropriately
    - Hide sensitive details in production
    - _Requirements: 3.5_

  - [ ] 8.2 Add request validation middleware
    - Create validation schemas for each content type
    - Validate request bodies before processing
    - Return clear validation error messages
    - _Requirements: 6.6, 6.7_

  - [ ]* 8.3 Write unit tests for error handling
    - Test error response format
    - Test different error status codes
    - Test validation error messages
    - _Requirements: 3.5, 6.6, 6.7_

- [ ] 9. Checkpoint - Ensure API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. React admin interface setup
  - [ ] 10.1 Initialize React project with TypeScript
    - Create React app with Vite or Create React App
    - Install dependencies (React Router, Axios, React Hook Form, TailwindCSS)
    - Set up TailwindCSS configuration
    - Create basic folder structure (components, pages, services, contexts)
    - _Requirements: 5.1_

  - [ ] 10.2 Create authentication context and provider
    - Implement AuthContext with login/logout functions
    - Store JWT token in localStorage
    - Provide authentication state to components
    - _Requirements: 4.1, 4.2_

  - [ ] 10.3 Create API service layer
    - Create axios instance with base URL and interceptors
    - Add token to requests automatically
    - Handle 401 responses by redirecting to login
    - Create service functions for all API endpoints
    - _Requirements: 3.1, 3.2_

  - [ ]* 10.4 Write unit tests for auth context
    - Test login/logout functionality
    - Test token storage and retrieval
    - Test authentication state updates
    - _Requirements: 4.1, 4.2_

- [ ] 11. Admin interface - Authentication pages
  - [ ] 11.1 Create login page
    - Build login form with username and password fields
    - Handle form submission and API call
    - Display error messages for failed login
    - Redirect to dashboard on success
    - _Requirements: 4.1_

  - [ ] 11.2 Create protected route component
    - Check authentication status before rendering
    - Redirect to login if not authenticated
    - Wrap dashboard routes with protection
    - _Requirements: 4.3_

  - [ ]* 11.3 Write unit tests for login page
    - Test form validation
    - Test successful login flow
    - Test error display
    - _Requirements: 4.1_

- [ ] 12. Admin interface - Layout and navigation
  - [ ] 12.1 Create dashboard layout component
    - Build sidebar with navigation menu
    - Add header with user info and logout button
    - Create main content area
    - Make responsive for mobile
    - _Requirements: 5.2_

  - [ ] 12.2 Create navigation menu
    - Add links for all content types (Projects, Services, FAQ, About, Contact)
    - Highlight active route
    - _Requirements: 5.2_

- [ ] 13. Admin interface - Content list views
  - [ ] 13.1 Create reusable ContentList component
    - Display data in table format
    - Show key fields (title, date, status)
    - Add edit and delete buttons for each row
    - Implement pagination controls
    - Add search input
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 13.2 Create ProjectList page
    - Use ContentList component with project-specific columns
    - Fetch projects from API on mount
    - Handle loading and error states
    - _Requirements: 5.2, 5.3, 5.6_

  - [ ] 13.3 Create ServiceList page
    - Use ContentList component with service-specific columns
    - Fetch services from API
    - _Requirements: 5.2, 5.3, 5.6_

  - [ ]* 13.4 Write unit tests for ContentList component
    - Test rendering with data
    - Test pagination
    - Test search functionality
    - Test edit/delete button clicks
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 14. Admin interface - Image uploader component
  - [ ] 14.1 Create ImageUploader component
    - Implement drag-and-drop interface
    - Show image preview after selection
    - Display upload progress
    - Support multiple image uploads
    - Show uploaded image URLs
    - _Requirements: 2.1, 6.5_

  - [ ]* 14.2 Write unit tests for ImageUploader
    - Test file selection
    - Test drag-and-drop
    - Test preview display
    - Test upload progress
    - _Requirements: 2.1, 6.5_

- [ ] 15. Admin interface - Content form views
  - [ ] 15.1 Create reusable ContentForm component
    - Build dynamic form based on content type schema
    - Integrate React Hook Form for validation
    - Add rich text editor for content fields
    - Integrate ImageUploader component
    - Show save and cancel buttons
    - Display validation errors inline
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ] 15.2 Create ProjectForm page
    - Use ContentForm with project schema
    - Handle create and edit modes
    - Pre-populate form for edit mode
    - Submit to appropriate API endpoint
    - Show success message and redirect on save
    - _Requirements: 6.1, 6.2, 6.3, 6.8_

  - [ ] 15.3 Create ServiceForm page
    - Use ContentForm with service schema
    - Handle create and edit modes
    - _Requirements: 6.1, 6.2, 6.3, 6.8_

  - [ ] 15.4 Create forms for other content types
    - Create FAQForm page
    - Create AboutForm page
    - Create ContactForm page
    - _Requirements: 6.1, 6.2, 6.3, 6.8_

  - [ ]* 15.5 Write property test for form validation
    - **Property 4: Form Validation Consistency**
    - **Validates: Requirements 6.6, 6.7**

  - [ ]* 15.6 Write unit tests for ContentForm
    - Test form rendering
    - Test validation error display
    - Test form submission
    - Test pre-population in edit mode
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6, 6.7, 6.8_

- [ ] 16. Admin interface - Delete functionality
  - [ ] 16.1 Create delete confirmation modal
    - Build modal component with confirmation message
    - Add confirm and cancel buttons
    - _Requirements: 7.2_

  - [ ] 16.2 Implement delete handlers
    - Call delete API endpoint on confirmation
    - Show success message
    - Refresh list view after deletion
    - Handle errors gracefully
    - _Requirements: 7.1, 7.3, 7.5_

  - [ ]* 16.3 Write unit tests for delete functionality
    - Test modal display
    - Test delete API call
    - Test list refresh after deletion
    - Test error handling
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [ ] 17. Admin interface - SEO metadata management
  - [ ] 17.1 Add SEO fields to all content forms
    - Add SEO title input field
    - Add SEO description textarea
    - Show character count for both fields
    - Add validation for max length
    - _Requirements: 10.1, 10.5_

  - [ ]* 17.2 Write property test for SEO metadata
    - **Property 6: SEO Metadata Propagation**
    - **Validates: Requirements 10.2, 10.3**

  - [ ]* 17.3 Write unit tests for SEO fields
    - Test character count display
    - Test max length validation
    - Test SEO data in API requests
    - _Requirements: 10.1, 10.2, 10.5_

- [ ] 18. Admin interface - Content preview
  - [ ] 18.1 Create preview modal component
    - Build modal that displays content preview
    - Style preview to match frontend appearance
    - Add close button
    - _Requirements: 11.2, 11.3_

  - [ ] 18.2 Add preview button to forms
    - Add preview button to ContentForm
    - Render preview with current form values (unsaved)
    - _Requirements: 11.1, 11.4_

  - [ ]* 18.3 Write unit tests for preview functionality
    - Test preview modal rendering
    - Test preview with unsaved changes
    - Test preview styling
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 19. Checkpoint - Ensure admin interface works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 20. Data migration script
  - [ ] 20.1 Create migration script setup
    - Initialize script with Sanity and MongoDB connections
    - Add command-line arguments for dry-run mode
    - Set up logging for migration progress
    - _Requirements: 8.1, 8.6_

  - [ ] 20.2 Implement content fetching from Sanity
    - Fetch all projects from Sanity
    - Fetch all services from Sanity
    - Fetch FAQ, about, and contact data
    - _Requirements: 8.2_

  - [ ] 20.3 Implement data transformation
    - Transform Sanity data format to MongoDB schema
    - Convert Sanity image references to URLs
    - Convert portable text to HTML
    - Handle nested structures and arrays
    - _Requirements: 8.3_

  - [ ] 20.4 Implement image migration
    - Download images from Sanity CDN
    - Upload images to AWS S3 with organized folder structure
    - Update MongoDB records with new S3 URLs
    - Optional: Set up CloudFront distribution for CDN
    - _Requirements: 8.4_

  - [ ] 20.5 Implement data insertion to MongoDB
    - Insert transformed data into MongoDB collections
    - Handle duplicate detection (skip or update)
    - Preserve relationships between content
    - _Requirements: 8.3, 8.5_

  - [ ] 20.6 Add migration reporting
    - Track successful and failed migrations
    - Generate summary report with counts
    - Log any errors or warnings
    - _Requirements: 8.6, 8.7_

  - [ ]* 20.7 Write property test for migration
    - **Property 5: Migration Data Preservation**
    - **Validates: Requirements 8.2, 8.3, 8.5**

  - [ ]* 20.8 Write unit tests for migration
    - Test data transformation functions
    - Test image download and upload
    - Test MongoDB insertion
    - Test error handling
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 21. Frontend integration - Replace Sanity client
  - [ ] 21.1 Create API utility functions
    - Create fetch wrapper with error handling
    - Add functions for each content type endpoint
    - Handle loading states
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 21.2 Update project pages
    - Replace Sanity client imports with API calls
    - Update data fetching in getStaticProps/getServerSideProps
    - Update all project internal pages
    - _Requirements: 9.1, 9.2_

  - [ ] 21.3 Update service pages
    - Replace Sanity client with API calls
    - Update all service internal pages
    - _Requirements: 9.1, 9.2_

  - [ ] 21.4 Update other pages
    - Update FAQ page
    - Update About page
    - Update Contact page
    - Update main service page
    - _Requirements: 9.1, 9.2_

  - [ ] 21.5 Update image URL handling
    - Remove Sanity urlFor helper usage
    - Use direct image URLs from API
    - Update all Image components
    - _Requirements: 9.6_

  - [ ] 21.6 Implement API response caching
    - Add caching strategy for static content
    - Use Next.js ISR (Incremental Static Regeneration)
    - _Requirements: 9.5_

  - [ ]* 21.7 Write unit tests for API utility functions
    - Test fetch wrapper error handling
    - Test loading state management
    - Test data transformation
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 22. Environment configuration and documentation
  - [ ] 22.1 Create environment variable templates
    - Create .env.example for backend API
    - Create .env.example for admin interface
    - Create .env.example for frontend
    - Document all required variables (MongoDB, AWS S3, JWT)
    - _Requirements: 12.1, 12.3_

  - [ ] 22.2 Add environment validation
    - Create startup script that checks for required variables
    - Fail fast if critical variables are missing
    - _Requirements: 12.4_

  - [ ] 22.3 Create deployment documentation
    - Document MongoDB setup steps
    - Document AWS S3 bucket creation and configuration
    - Document CloudFront CDN setup (optional)
    - Document API deployment process
    - Document admin interface deployment
    - Document frontend deployment
    - Document migration execution steps
    - _Requirements: 12.1, 12.2, 12.3, 12.5_

- [ ] 23. Final integration testing
  - [ ]* 23.1 Run end-to-end tests
    - Test complete admin workflow (login → create → edit → delete)
    - Test frontend display of content from API
    - Test image upload and display
    - Test migration script with sample data
    - _Requirements: All_

  - [ ] 23.2 Performance testing
    - Test API response times under load
    - Test image loading performance
    - Test admin interface responsiveness
    - _Requirements: 3.1, 3.2_

- [ ] 24. Final checkpoint - Production readiness
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all environment variables are documented
  - Confirm migration script is tested and ready
  - Verify backup strategy is in place

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The migration should be tested thoroughly in a staging environment before production
- Keep Sanity data as backup for at least 30 days after migration
