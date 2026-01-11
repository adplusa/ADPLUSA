#!/usr/bin/env ts-node

import mongoose from 'mongoose';
import { config } from '../config/env';
import { User } from '../database/schemas/user.schema';
import { Tag } from '../database/schemas/tag.schema';
import { Media } from '../database/schemas/media.schema';
import { Project } from '../database/schemas/project.schema';
import { Service } from '../database/schemas/service.schema';
import { About } from '../database/schemas/about.schema';
import { Contact } from '../database/schemas/contact.schema';
import { FAQ } from '../database/schemas/faq.schema';

async function seedComprehensiveData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found. Please run create-user script first.');
    }

    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Tag.deleteMany({}),
      Media.deleteMany({}),
      Project.deleteMany({}),
      Service.deleteMany({}),
      About.deleteMany({}),
      Contact.deleteMany({}),
      FAQ.deleteMany({}),
    ]);

    // Create Tags
    console.log('🏷️  Creating tags...');
    const tags = await Tag.insertMany([
      { name: 'Architecture', slug: 'architecture', description: 'Architectural design and planning', color: '#3B82F6' },
      { name: 'Interior Design', slug: 'interior-design', description: 'Interior design and decoration', color: '#10B981' },
      { name: 'Residential', slug: 'residential', description: 'Residential projects and homes', color: '#F59E0B' },
      { name: 'Commercial', slug: 'commercial', description: 'Commercial buildings and spaces', color: '#EF4444' },
      { name: '3D Modeling', slug: '3d-modeling', description: '3D modeling and visualization', color: '#8B5CF6' },
      { name: 'Modern', slug: 'modern', description: 'Modern design style', color: '#F97316' },
      { name: 'Planning', slug: 'planning', description: 'Project planning and management', color: '#84CC16' },
      { name: 'Consultation', slug: 'consultation', description: 'Design consultation services', color: '#06B6D4' },
    ]);

    // Create Media
    console.log('📸 Creating media files...');
    const media = await Media.insertMany([
      {
        title: 'Modern House Exterior',
        filename: 'modern-house-1.jpg',
        originalName: 'modern-house-exterior.jpg',
        mimeType: 'image/jpeg',
        size: 2048576,
        s3Path: 'media/modern-house-1.jpg',
        s3Url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
        width: 1920,
        height: 1080,
        alt: 'Modern house exterior with clean lines',
        description: 'A stunning modern house exterior showcasing contemporary architectural design',
        tags: [tags[0]._id, tags[2]._id, tags[5]._id],
        uploadedBy: adminUser._id,
      },
      {
        title: 'Office Interior Design',
        filename: 'office-interior-1.jpg',
        originalName: 'office-interior-design.jpg',
        mimeType: 'image/jpeg',
        size: 1536000,
        s3Path: 'media/office-interior-1.jpg',
        s3Url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop',
        width: 1600,
        height: 900,
        alt: 'Modern office interior with open workspace',
        description: 'Contemporary office interior featuring collaborative workspaces',
        tags: [tags[1]._id, tags[3]._id],
        uploadedBy: adminUser._id,
      },
      {
        title: '3D Architectural Rendering',
        filename: '3d-render-1.jpg',
        originalName: '3d-architectural-rendering.jpg',
        mimeType: 'image/jpeg',
        size: 3072000,
        s3Path: 'media/3d-render-1.jpg',
        s3Url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2560&h=1440&fit=crop',
        width: 2560,
        height: 1440,
        alt: 'Photorealistic 3D architectural rendering',
        description: 'High-quality 3D visualization of architectural design concept',
        tags: [tags[4]._id, tags[0]._id],
        uploadedBy: adminUser._id,
      },
      {
        title: 'Living Room Design',
        filename: 'living-room-1.jpg',
        originalName: 'living-room-design.jpg',
        mimeType: 'image/jpeg',
        size: 1843200,
        s3Path: 'media/living-room-1.jpg',
        s3Url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&h=1200&fit=crop',
        width: 1800,
        height: 1200,
        alt: 'Elegant living room interior design',
        description: 'Sophisticated living room design with modern furniture',
        tags: [tags[1]._id, tags[2]._id],
        uploadedBy: adminUser._id,
      },
      {
        title: 'Commercial Building Facade',
        filename: 'commercial-facade-1.jpg',
        originalName: 'commercial-building-facade.jpg',
        mimeType: 'image/jpeg',
        size: 2457600,
        s3Path: 'media/commercial-facade-1.jpg',
        s3Url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2048&h=1365&fit=crop',
        width: 2048,
        height: 1365,
        alt: 'Modern commercial building facade',
        description: 'Contemporary commercial building exterior with glass elements',
        tags: [tags[0]._id, tags[3]._id],
        uploadedBy: adminUser._id,
      },
      {
        title: 'Kitchen Design',
        filename: 'kitchen-design-1.jpg',
        originalName: 'kitchen-design.jpg',
        mimeType: 'image/jpeg',
        size: 1920000,
        s3Path: 'media/kitchen-design-1.jpg',
        s3Url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1280&fit=crop',
        width: 1920,
        height: 1280,
        alt: 'Modern kitchen design with island',
        description: 'Contemporary kitchen design featuring a large island',
        tags: [tags[1]._id, tags[2]._id],
        uploadedBy: adminUser._id,
      },
    ]);

    // Create Projects
    console.log('🏗️  Creating projects...');
    const projects = await Project.insertMany([
      {
        title: 'Luxury Villa Design',
        slug: 'luxury-villa-design',
        description: 'A stunning modern villa with panoramic views and contemporary design elements.',
        content: `
          <h2>Project Overview</h2>
          <p>This luxury villa project showcases our expertise in modern residential architecture. The design emphasizes clean lines, open spaces, and seamless integration with the natural landscape.</p>
          
          <h3>Key Features</h3>
          <ul>
            <li>5 bedrooms and 4 bathrooms</li>
            <li>Open-plan living areas</li>
            <li>Floor-to-ceiling windows</li>
            <li>Infinity pool and outdoor entertainment area</li>
            <li>Smart home automation system</li>
          </ul>
          
          <h3>Design Philosophy</h3>
          <p>Our approach focused on creating a harmonious blend of indoor and outdoor living, maximizing natural light while maintaining privacy and comfort.</p>
        `,
        images: [
          { url: media[0].s3Url, alt: 'Villa exterior view', width: 1920, height: 1080 },
          { url: media[3].s3Url, alt: 'Villa interior living room', width: 1800, height: 1200 },
        ],
        category: 'Residential',
        featured: true,
        tags: [tags[0]._id, tags[2]._id, tags[5]._id],
        seoTitle: 'Luxury Villa Design - Modern Residential Architecture',
        seoDescription: 'Explore our luxury villa design project featuring modern architecture and stunning views.',
      },
      {
        title: 'Corporate Office Renovation',
        slug: 'corporate-office-renovation',
        description: 'Complete renovation of a 10,000 sq ft corporate office space with modern amenities.',
        content: `
          <h2>Project Scope</h2>
          <p>This comprehensive office renovation transformed a traditional workspace into a modern, collaborative environment that promotes productivity and employee well-being.</p>
          
          <h3>Renovation Highlights</h3>
          <ul>
            <li>Open-plan workstations with flexible layouts</li>
            <li>Modern conference rooms with AV technology</li>
            <li>Breakout areas and collaboration spaces</li>
            <li>Upgraded lighting and HVAC systems</li>
            <li>Sustainable materials and energy-efficient solutions</li>
          </ul>
        `,
        images: [
          { url: media[1].s3Url, alt: 'Modern office interior', width: 1600, height: 900 },
          { url: media[4].s3Url, alt: 'Office building exterior', width: 2048, height: 1365 },
        ],
        category: 'Commercial',
        featured: true,
        tags: [tags[1]._id, tags[3]._id],
        seoTitle: 'Corporate Office Renovation - Modern Workspace Design',
        seoDescription: 'See how we transformed a traditional office into a modern workspace.',
      },
      {
        title: 'Residential Complex Planning',
        slug: 'residential-complex-planning',
        description: 'Master planning for a 50-unit residential complex with community amenities.',
        content: `
          <h2>Master Planning Approach</h2>
          <p>This residential complex project required careful planning to balance density with livability.</p>
          
          <h3>Project Components</h3>
          <ul>
            <li>50 residential units in various configurations</li>
            <li>Community center and fitness facility</li>
            <li>Landscaped courtyards and walking paths</li>
            <li>Underground parking for 75 vehicles</li>
          </ul>
        `,
        images: [
          { url: media[2].s3Url, alt: '3D rendering of residential complex', width: 2560, height: 1440 },
        ],
        category: 'Residential',
        featured: false,
        tags: [tags[0]._id, tags[2]._id, tags[6]._id],
        seoTitle: 'Residential Complex Planning - Community-Focused Design',
        seoDescription: 'Master planning for a 50-unit residential complex.',
      },
      {
        title: 'Modern Family Home',
        slug: 'modern-family-home',
        description: 'Contemporary family home design with sustainable features and smart technology.',
        content: `
          <h2>Family-Centered Design</h2>
          <p>This modern family home was designed to accommodate the needs of a growing family while incorporating sustainable features.</p>
          
          <h3>Home Features</h3>
          <ul>
            <li>4 bedrooms including master suite</li>
            <li>Open kitchen and family room</li>
            <li>Home office and study areas</li>
            <li>Solar panels and energy-efficient systems</li>
          </ul>
        `,
        images: [
          { url: media[0].s3Url, alt: 'Modern family home exterior', width: 1920, height: 1080 },
          { url: media[5].s3Url, alt: 'Kitchen design', width: 1920, height: 1280 },
        ],
        category: 'Residential',
        featured: true,
        tags: [tags[0]._id, tags[2]._id, tags[5]._id],
        seoTitle: 'Modern Family Home Design - Sustainable Living',
        seoDescription: 'Contemporary family home featuring sustainable design and smart technology.',
      },
      {
        title: 'Boutique Hotel Interior',
        slug: 'boutique-hotel-interior',
        description: 'Interior design for a 25-room boutique hotel with unique character.',
        content: `
          <h2>Design Concept</h2>
          <p>This boutique hotel interior design project focused on creating a unique guest experience.</p>
          
          <h3>Design Elements</h3>
          <ul>
            <li>Custom furniture and lighting fixtures</li>
            <li>Local artwork and cultural elements</li>
            <li>Luxury spa and wellness facilities</li>
            <li>Rooftop restaurant and bar</li>
          </ul>
        `,
        images: [
          { url: media[3].s3Url, alt: 'Hotel lobby interior', width: 1800, height: 1200 },
        ],
        category: 'Commercial',
        featured: false,
        tags: [tags[1]._id, tags[3]._id],
        seoTitle: 'Boutique Hotel Interior Design - Luxury Hospitality',
        seoDescription: 'Interior design for a boutique hotel combining culture with luxury.',
      },
    ]);

    // Create Services
    console.log('🛠️  Creating services...');
    const services = await Service.insertMany([
      {
        title: 'Architectural Design',
        slug: 'architectural-design',
        description: 'Complete architectural design services from concept to construction documentation.',
        content: `
          <h2>Comprehensive Architectural Services</h2>
          <p>Our architectural design services cover every aspect of the design process, ensuring your vision becomes reality with precision and creativity.</p>
          
          <h3>Our Process</h3>
          <ol>
            <li><strong>Initial Consultation</strong> - Understanding your needs and vision</li>
            <li><strong>Concept Development</strong> - Creating initial design concepts</li>
            <li><strong>Design Development</strong> - Refining and detailing the design</li>
            <li><strong>Construction Documentation</strong> - Preparing detailed drawings</li>
          </ol>
          
          <h3>What's Included</h3>
          <ul>
            <li>Site analysis and feasibility studies</li>
            <li>Conceptual design and 3D visualizations</li>
            <li>Detailed architectural drawings</li>
            <li>Building code compliance review</li>
          </ul>
        `,
        bannerImage: { url: media[0].s3Url },
        features: [
          { title: 'Custom Design Solutions', description: 'Tailored architectural solutions for your needs.' },
          { title: 'Sustainable Design', description: 'Environmentally conscious design approaches.' },
          { title: 'Code Compliance', description: 'Ensuring designs meet building codes.' },
        ],
        image: { url: media[2].s3Url },
        seoTitle: 'Professional Architectural Design Services',
        seoDescription: 'Expert architectural design services from concept to construction.',
      },
      {
        title: 'Interior Design',
        slug: 'interior-design',
        description: 'Professional interior design services for residential and commercial spaces.',
        content: `
          <h2>Transform Your Space</h2>
          <p>Our interior design services create beautiful, functional spaces that reflect your personality.</p>
          
          <h3>Design Specialties</h3>
          <ul>
            <li>Residential interior design</li>
            <li>Commercial space planning</li>
            <li>Kitchen and bathroom design</li>
            <li>Furniture selection and custom pieces</li>
          </ul>
        `,
        bannerImage: { url: media[3].s3Url },
        features: [
          { title: 'Space Planning', description: 'Optimizing layouts for maximum functionality.' },
          { title: 'Material Selection', description: 'Curating high-quality materials and finishes.' },
        ],
        image: { url: media[1].s3Url },
        seoTitle: 'Professional Interior Design Services',
        seoDescription: 'Transform your space with our expert interior design services.',
      },
      {
        title: '3D Visualization',
        slug: '3d-visualization',
        description: 'Photorealistic 3D renderings and virtual tours for architectural projects.',
        content: `
          <h2>Bring Your Vision to Life</h2>
          <p>Our 3D visualization services help you see your project before it's built.</p>
          
          <h3>Visualization Services</h3>
          <ul>
            <li>Photorealistic exterior renderings</li>
            <li>Interior visualization and walkthroughs</li>
            <li>Virtual reality experiences</li>
            <li>Animation and fly-through videos</li>
          </ul>
        `,
        bannerImage: { url: media[2].s3Url },
        features: [
          { title: 'Photorealistic Quality', description: 'High-quality renderings that represent reality.' },
          { title: 'Multiple Viewpoints', description: 'Comprehensive views from various angles.' },
        ],
        image: { url: media[4].s3Url },
        seoTitle: '3D Architectural Visualization Services',
        seoDescription: 'Professional 3D rendering and visualization services.',
      },
      {
        title: 'Design Consultation',
        slug: 'design-consultation',
        description: 'Expert design advice and consultation for your projects.',
        content: `
          <h2>Expert Design Guidance</h2>
          <p>Our design consultation services provide professional expertise to help you make informed decisions.</p>
          
          <h3>Consultation Types</h3>
          <ul>
            <li>Initial project assessment</li>
            <li>Design review and feedback</li>
            <li>Material and finish selection</li>
            <li>Space planning optimization</li>
          </ul>
        `,
        bannerImage: { url: media[1].s3Url },
        features: [
          { title: 'Flexible Engagement', description: 'Consultation tailored to your needs.' },
          { title: 'Cost-Effective', description: 'Professional expertise without full commitment.' },
        ],
        image: { url: media[0].s3Url },
        seoTitle: 'Architectural Design Consultation Services',
        seoDescription: 'Expert design consultation for architectural projects.',
      },
    ]);

    // Create About page
    console.log('ℹ️  Creating about page...');
    await About.create({
      title: 'About Our Design Studio',
      content: `
        <h2>Welcome to Our Architectural Design Studio</h2>
        <p>With over 15 years of experience in architectural design and interior planning, our studio has been creating exceptional spaces that inspire and function beautifully.</p>
        
        <h3>Our Mission</h3>
        <p>We believe that great design has the power to transform lives. Our mission is to create spaces that not only meet our clients' functional needs but also inspire and uplift those who experience them.</p>
        
        <h3>Our Team</h3>
        <p>Our multidisciplinary team includes licensed architects, interior designers, and project managers who work collaboratively to bring your vision to life.</p>
        
        <h3>Our Approach</h3>
        <ul>
          <li><strong>Client-Centered Design:</strong> We listen carefully to understand your needs and preferences.</li>
          <li><strong>Sustainable Solutions:</strong> We prioritize environmentally responsible design practices.</li>
          <li><strong>Innovation:</strong> We embrace new technologies and design methodologies.</li>
          <li><strong>Quality:</strong> We maintain the highest standards in every aspect of our work.</li>
        </ul>
      `,
      seoTitle: 'About Our Design Studio - Expert Services',
      seoDescription: 'Learn about our design studio with 15+ years experience.',
    });

    // Create Contact page
    console.log('📞 Creating contact page...');
    await Contact.create({
      title: 'Get in Touch',
      description: 'Ready to transform your space? We\'d love to hear about your project and discuss how we can help bring your vision to life.',
      contactInfo: {
        email: 'info@designstudio.com',
        phone: '(555) 123-4567',
        address: '123 Design Street, Creative District, City, State 12345',
        socialMedia: {
          facebook: 'https://facebook.com/designstudio',
          instagram: 'https://instagram.com/designstudio',
          linkedin: 'https://linkedin.com/company/designstudio',
          twitter: 'https://twitter.com/designstudio',
        },
      },
      seoTitle: 'Contact Our Design Studio - Start Today',
      seoDescription: 'Contact our design studio to discuss your project.',
    });

    // Create FAQ entries
    console.log('❓ Creating FAQ entries...');
    await FAQ.create({
      title: 'Frequently Asked Questions',
      categories: [
        {
          title: 'Services',
          description: 'Questions about our design services and offerings',
          faqs: [
            {
              question: 'What types of projects do you work on?',
              answer: 'We work on a wide range of projects including residential homes, commercial buildings, office spaces, retail environments, and hospitality venues. Our expertise covers both new construction and renovation projects.',
            },
            {
              question: 'Do you provide construction services?',
              answer: 'We focus on design services and work with a network of trusted contractors and builders. We can recommend qualified contractors and provide construction administration services.',
            },
            {
              question: 'Do you offer 3D visualizations?',
              answer: 'Yes, we provide photorealistic 3D renderings and virtual tours to help you visualize your project before construction begins.',
            },
          ],
        },
        {
          title: 'Process',
          description: 'Questions about our design process and timeline',
          faqs: [
            {
              question: 'How long does a typical project take?',
              answer: 'Project timelines vary depending on scope and complexity. A residential design project typically takes 3-6 months from initial consultation to final construction documents. Commercial projects may take 6-12 months or longer.',
            },
            {
              question: 'Can you help with permits and approvals?',
              answer: 'Absolutely. We prepare all necessary drawings and documentation for permit applications and can guide you through the approval process with local authorities.',
            },
            {
              question: 'How do you handle design changes during the project?',
              answer: 'We understand that design evolution is natural during the process. Minor changes are typically included, while significant changes may require additional fees.',
            },
          ],
        },
        {
          title: 'Pricing',
          description: 'Questions about pricing and budget considerations',
          faqs: [
            {
              question: 'What is included in your design fees?',
              answer: 'Our design fees typically include initial consultation, concept development, design development, construction documentation, and basic construction administration.',
            },
            {
              question: 'Do you work with specific budgets?',
              answer: 'Yes, we work with clients across various budget ranges. During our initial consultation, we discuss your budget to ensure our design solutions align with your financial parameters.',
            },
          ],
        },
      ],
      seoTitle: 'FAQ - Design Studio Questions & Answers',
      seoDescription: 'Find answers to common questions about our design services.',
    });

    console.log('✅ Comprehensive database seeded successfully!');
    console.log(`   📊 Created ${tags.length} tags`);
    console.log(`   📸 Created ${media.length} media files`);
    console.log(`   🏗️  Created ${projects.length} projects`);
    console.log(`   🛠️  Created ${services.length} services`);
    console.log(`   ℹ️  Created 1 about page`);
    console.log(`   📞 Created 1 contact page`);
    console.log(`   ❓ Created 1 FAQ document with 3 categories`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

if (require.main === module) {
  seedComprehensiveData();
}

export { seedComprehensiveData };