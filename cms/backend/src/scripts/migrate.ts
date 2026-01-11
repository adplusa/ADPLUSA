#!/usr/bin/env ts-node

/**
 * Migration Script: Sanity CMS to MongoDB
 * 
 * This script migrates all content from Sanity CMS to MongoDB, including:
 * - Projects
 * - Services
 * - FAQ
 * - About page
 * - Contact page
 * - Images (downloaded from Sanity CDN and uploaded to S3)
 * 
 * Usage:
 *   npm run migrate              # Run full migration
 *   npm run migrate -- --dry-run # Preview migration without making changes
 *   npm run migrate -- --help    # Show help
 */

import { createClient } from '@sanity/client';
import { toHTML } from '@portabletext/to-html';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { config as envConfig } from '../config/env';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import models
import { Project } from '../database/schemas/project.schema';
import { Service } from '../database/schemas/service.schema';
import { FAQ } from '../database/schemas/faq.schema';
import { About } from '../database/schemas/about.schema';
import { Contact } from '../database/schemas/contact.schema';

// Import utilities
import { uploadImageToS3 } from '../utils/s3';
import axios from 'axios';

/**
 * Sanity image reference interface
 */
interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

interface SanityImage {
  asset?: SanityImageAsset;
}

/**
 * Portable text block interface
 */
interface PortableTextBlock {
  _type: string;
  children?: Array<{ text: string }>;
  [key: string]: any;
}

/**
 * Migration configuration
 */
interface MigrationConfig {
  dryRun: boolean;
  verbose: boolean;
}

/**
 * Migration statistics
 */
interface MigrationStats {
  projects: { success: number; failed: number; skipped: number };
  services: { success: number; failed: number; skipped: number };
  faq: { success: number; failed: number; skipped: number };
  about: { success: number; failed: number; skipped: number };
  contact: { success: number; failed: number; skipped: number };
  images: { success: number; failed: number };
  errors: Array<{ type: string; message: string; details?: any }>;
}

/**
 * Logger utility
 */
class Logger {
  private verbose: boolean;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  info(message: string, ...args: any[]) {
    console.log(`[INFO] ${message}`, ...args);
  }

  success(message: string, ...args: any[]) {
    console.log(`✓ [SUCCESS] ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`✗ [ERROR] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`⚠ [WARN] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]) {
    if (this.verbose) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  section(title: string) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${title}`);
    console.log(`${'='.repeat(60)}\n`);
  }
}

/**
 * Migration class
 */
class SanityToMongoMigration {
  private sanityClient: any;
  private logger: Logger;
  private config: MigrationConfig;
  private stats: MigrationStats;

  constructor(config: MigrationConfig) {
    this.config = config;
    this.logger = new Logger(config.verbose);
    this.stats = {
      projects: { success: 0, failed: 0, skipped: 0 },
      services: { success: 0, failed: 0, skipped: 0 },
      faq: { success: 0, failed: 0, skipped: 0 },
      about: { success: 0, failed: 0, skipped: 0 },
      contact: { success: 0, failed: 0, skipped: 0 },
      images: { success: 0, failed: 0 },
      errors: [],
    };

    // Initialize Sanity client
    this.sanityClient = createClient({
      projectId: process.env.SANITY_PROJECT_ID || '5ippxm43',
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: '2024-01-01',
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
    });
  }

  /**
   * Connect to MongoDB
   */
  async connectMongoDB(): Promise<void> {
    try {
      this.logger.info('Connecting to MongoDB...');
      await mongoose.connect(envConfig.mongodbUri);
      this.logger.success('Connected to MongoDB');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnectMongoDB(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.info('Disconnected from MongoDB');
    } catch (error) {
      this.logger.error('Failed to disconnect from MongoDB:', error);
    }
  }

  /**
   * Run the complete migration
   */
  async run(): Promise<void> {
    try {
      this.logger.section('Starting Sanity to MongoDB Migration');

      if (this.config.dryRun) {
        this.logger.warn('DRY RUN MODE - No changes will be made to the database');
      }

      // Connect to MongoDB
      await this.connectMongoDB();

      // Run migrations for each content type
      this.logger.section('Migrating Projects');
      await this.migrateProjects();

      this.logger.section('Migrating Services');
      await this.migrateServices();

      this.logger.section('Migrating FAQ');
      await this.migrateFAQ();

      this.logger.section('Migrating About Page');
      await this.migrateAbout();

      this.logger.section('Migrating Contact Page');
      await this.migrateContact();

      // Generate report
      this.generateReport();

      // Disconnect
      await this.disconnectMongoDB();

      this.logger.section('Migration Complete');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      await this.disconnectMongoDB();
      process.exit(1);
    }
  }

  /**
   * Fetch all projects from Sanity
   */
  private async fetchProjectsFromSanity(): Promise<any[]> {
    try {
      this.logger.info('Fetching projects from Sanity...');
      
      const query = `*[_type == "projectPage"][0]{
        seoTitle,
        seoDescription,
        heading,
        projects[]{
          title,
          image{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          },
          link
        }
      }`;

      const data = await this.sanityClient.fetch(query);
      
      if (!data || !data.projects) {
        this.logger.warn('No projects found in Sanity');
        return [];
      }

      this.logger.success(`Fetched ${data.projects.length} projects from Sanity`);
      return data.projects;
    } catch (error) {
      this.logger.error('Failed to fetch projects from Sanity:', error);
      this.stats.errors.push({
        type: 'FETCH_PROJECTS',
        message: 'Failed to fetch projects from Sanity',
        details: error,
      });
      return [];
    }
  }

  /**
   * Fetch all services from Sanity
   */
  private async fetchServicesFromSanity(): Promise<any[]> {
    try {
      this.logger.info('Fetching services from Sanity...');
      
      const query = `*[_type == "serviceTwoPage"][0]{
        seoTitle,
        seoDescription,
        title,
        serviceBannerImage{
          asset->{
            _id,
            url,
            metadata{
              dimensions{
                width,
                height
              }
            }
          }
        },
        serviceBannerImageDarkMode{
          asset->{
            _id,
            url,
            metadata{
              dimensions{
                width,
                height
              }
            }
          }
        },
        whyWorkWithUs{
          title,
          features[]{
            title,
            description
          },
          image{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          },
          imageDarkMode{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          }
        }
      }`;

      const data = await this.sanityClient.fetch(query);
      
      if (!data) {
        this.logger.warn('No services found in Sanity');
        return [];
      }

      // Convert the single service page to an array format
      const services = [];
      if (data.whyWorkWithUs) {
        services.push(data);
      }

      this.logger.success(`Fetched service data from Sanity`);
      return services;
    } catch (error) {
      this.logger.error('Failed to fetch services from Sanity:', error);
      this.stats.errors.push({
        type: 'FETCH_SERVICES',
        message: 'Failed to fetch services from Sanity',
        details: error,
      });
      return [];
    }
  }

  /**
   * Fetch FAQ from Sanity
   */
  private async fetchFAQFromSanity(): Promise<any | null> {
    try {
      this.logger.info('Fetching FAQ from Sanity...');
      
      const query = `*[_type == "faqSection"][0]{
        seoTitle,
        seoDescription,
        title,
        categories[]{
          title,
          description,
          chatLink,
          image{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          },
          imageDarkMode{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          },
          faqs[]{
            question,
            answer
          }
        }
      }`;

      const data = await this.sanityClient.fetch(query);
      
      if (!data) {
        this.logger.warn('No FAQ found in Sanity');
        return null;
      }

      this.logger.success('Fetched FAQ from Sanity');
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch FAQ from Sanity:', error);
      this.stats.errors.push({
        type: 'FETCH_FAQ',
        message: 'Failed to fetch FAQ from Sanity',
        details: error,
      });
      return null;
    }
  }

  /**
   * Fetch About page from Sanity
   */
  private async fetchAboutFromSanity(): Promise<any | null> {
    try {
      this.logger.info('Fetching About page from Sanity...');
      
      const query = `*[_type == "aboutPage"][0]{
        seoTitle,
        seoDescription,
        allowLightHeading,
        allowUsHeading,
        allowRightHeading,
        paragraph,
        anchorLinks[]{
          label,
          targetId
        },
        sections[]{
          sectionId,
          title,
          body,
          image{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          },
          imageDarkMode{
            asset->{
              _id,
              url,
              metadata{
                dimensions{
                  width,
                  height
                }
              }
            }
          }
        }
      }`;

      const data = await this.sanityClient.fetch(query);
      
      if (!data) {
        this.logger.warn('No About page found in Sanity');
        return null;
      }

      this.logger.success('Fetched About page from Sanity');
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch About page from Sanity:', error);
      this.stats.errors.push({
        type: 'FETCH_ABOUT',
        message: 'Failed to fetch About page from Sanity',
        details: error,
      });
      return null;
    }
  }

  /**
   * Fetch Contact page from Sanity
   */
  private async fetchContactFromSanity(): Promise<any | null> {
    try {
      this.logger.info('Fetching Contact page from Sanity...');
      
      const query = `*[_type == "contactPage"][0]{
        seoTitle,
        seoDescription,
        mainHeading,
        contactImage{
          asset->{
            _id,
            url,
            metadata{
              dimensions{
                width,
                height
              }
            }
          }
        },
        contactImageDarkMode{
          asset->{
            _id,
            url,
            metadata{
              dimensions{
                width,
                height
              }
            }
          }
        },
        introText,
        contactInfo{
          address,
          phone,
          email
        },
        googleMapEmbedUrl,
        whyWorkWithUsHeading,
        whyWorkWithUsItems[]{
          icon,
          title,
          description
        },
        rightImage{
          asset->{
            _id,
            url,
            metadata{
              dimensions{
                width,
                height
              }
            }
          }
        }
      }`;

      const data = await this.sanityClient.fetch(query);
      
      if (!data) {
        this.logger.warn('No Contact page found in Sanity');
        return null;
      }

      this.logger.success('Fetched Contact page from Sanity');
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch Contact page from Sanity:', error);
      this.stats.errors.push({
        type: 'FETCH_CONTACT',
        message: 'Failed to fetch Contact page from Sanity',
        details: error,
      });
      return null;
    }
  }

  /**
   * Migrate projects - Complete implementation
   */
  private async migrateProjects(): Promise<void> {
    const sanityProjects = await this.fetchProjectsFromSanity();
    this.logger.info(`Found ${sanityProjects.length} projects to migrate`);

    for (let i = 0; i < sanityProjects.length; i++) {
      const sanityProject = sanityProjects[i];
      
      try {
        // Transform project data
        const transformedProject = this.transformProject(sanityProject, i);
        
        this.logger.debug(`Processing project: ${transformedProject.title}`);

        // Migrate images
        const projectWithImages = await this.migrateProjectImages(
          transformedProject,
          transformedProject.slug
        );

        if (this.config.dryRun) {
          this.logger.info(`[DRY RUN] Would insert project: ${projectWithImages.title}`);
          this.stats.projects.success++;
          continue;
        }

        // Check if project already exists
        const existingProject = await Project.findOne({ slug: projectWithImages.slug });

        if (existingProject) {
          // Update existing project
          await Project.findByIdAndUpdate(existingProject._id, projectWithImages);
          this.logger.success(`Updated project: ${projectWithImages.title}`);
          this.stats.projects.skipped++;
        } else {
          // Insert new project
          await Project.create(projectWithImages);
          this.logger.success(`Inserted project: ${projectWithImages.title}`);
          this.stats.projects.success++;
        }
      } catch (error) {
        this.logger.error(`Failed to migrate project ${i + 1}:`, error);
        this.stats.projects.failed++;
        this.stats.errors.push({
          type: 'PROJECT_MIGRATION',
          message: `Failed to migrate project: ${sanityProject.title || `Project ${i + 1}`}`,
          details: error,
        });
      }
    }
  }

  /**
   * Convert Sanity image reference to URL string
   */
  private extractImageUrl(sanityImage: SanityImage | null | undefined): string | null {
    if (!sanityImage || !sanityImage.asset) {
      return null;
    }
    return sanityImage.asset.url || null;
  }

  /**
   * Extract image dimensions from Sanity image
   */
  private extractImageDimensions(sanityImage: SanityImage | null | undefined): { width?: number; height?: number } {
    if (!sanityImage || !sanityImage.asset || !sanityImage.asset.metadata) {
      return {};
    }
    const dimensions = sanityImage.asset.metadata.dimensions;
    return {
      width: dimensions?.width,
      height: dimensions?.height,
    };
  }

  /**
   * Convert Sanity portable text to HTML
   */
  private portableTextToHTML(portableText: PortableTextBlock[] | null | undefined): string {
    if (!portableText || !Array.isArray(portableText)) {
      return '';
    }

    try {
      // Use @portabletext/to-html to convert
      const html = toHTML(portableText, {
        components: {
          block: {
            normal: ({ children }) => `<p>${children}</p>`,
            h1: ({ children }) => `<h1>${children}</h1>`,
            h2: ({ children }) => `<h2>${children}</h2>`,
            h3: ({ children }) => `<h3>${children}</h3>`,
            h4: ({ children }) => `<h4>${children}</h4>`,
            h5: ({ children }) => `<h5>${children}</h5>`,
            h6: ({ children }) => `<h6>${children}</h6>`,
            blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
          },
          marks: {
            strong: ({ children }) => `<strong>${children}</strong>`,
            em: ({ children }) => `<em>${children}</em>`,
            code: ({ children }) => `<code>${children}</code>`,
            underline: ({ children }) => `<u>${children}</u>`,
            'strike-through': ({ children }) => `<s>${children}</s>`,
            link: ({ children, value }) => {
              const href = value?.href || '#';
              return `<a href="${href}">${children}</a>`;
            },
          },
          list: {
            bullet: ({ children }) => `<ul>${children}</ul>`,
            number: ({ children }) => `<ol>${children}</ol>`,
          },
          listItem: {
            bullet: ({ children }) => `<li>${children}</li>`,
            number: ({ children }) => `<li>${children}</li>`,
          },
        },
      });

      return html;
    } catch (error) {
      this.logger.error('Failed to convert portable text to HTML:', error);
      // Fallback: extract plain text
      return portableText
        .map((block) => {
          if (block._type === 'block' && block.children) {
            return block.children.map((child: any) => child.text).join('');
          }
          return '';
        })
        .join('\n');
    }
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Transform Sanity project to MongoDB format
   */
  private transformProject(sanityProject: any, index: number): any {
    const title = sanityProject.title || `Project ${index + 1}`;
    const slug = this.generateSlug(title);

    return {
      title,
      slug,
      description: sanityProject.description || '',
      images: sanityProject.image
        ? [
            {
              url: this.extractImageUrl(sanityProject.image) || '',
              alt: title,
              ...this.extractImageDimensions(sanityProject.image),
            },
          ]
        : [],
      category: sanityProject.category || '',
      featured: sanityProject.featured || false,
      link: sanityProject.link || '',
      seoTitle: sanityProject.seoTitle || title,
      seoDescription: sanityProject.seoDescription || '',
    };
  }

  /**
   * Transform Sanity service to MongoDB format
   */
  private transformService(sanityService: any, index: number): any {
    const title = sanityService.title || sanityService.whyWorkWithUs?.title || `Service ${index + 1}`;
    const slug = this.generateSlug(title);

    return {
      title,
      slug,
      description: sanityService.description || '',
      content: sanityService.content || '',
      bannerImage: {
        url: this.extractImageUrl(sanityService.serviceBannerImage) || '',
        darkModeUrl: this.extractImageUrl(sanityService.serviceBannerImageDarkMode) || '',
      },
      features: sanityService.whyWorkWithUs?.features || [],
      image: {
        url: this.extractImageUrl(sanityService.whyWorkWithUs?.image) || '',
        darkModeUrl: this.extractImageUrl(sanityService.whyWorkWithUs?.imageDarkMode) || '',
      },
      seoTitle: sanityService.seoTitle || title,
      seoDescription: sanityService.seoDescription || '',
    };
  }

  /**
   * Transform Sanity FAQ to MongoDB format
   */
  private transformFAQ(sanityFAQ: any): any {
    return {
      title: sanityFAQ.title || 'Frequently Asked Questions',
      categories: (sanityFAQ.categories || []).map((category: any) => ({
        title: category.title || '',
        description: category.description || '',
        chatLink: category.chatLink || '',
        image: {
          url: this.extractImageUrl(category.image) || '',
          darkModeUrl: this.extractImageUrl(category.imageDarkMode) || '',
        },
        faqs: (category.faqs || []).map((faq: any) => ({
          question: faq.question || '',
          answer: faq.answer || '',
        })),
      })),
      seoTitle: sanityFAQ.seoTitle || 'FAQ',
      seoDescription: sanityFAQ.seoDescription || '',
    };
  }

  /**
   * Transform Sanity About page to MongoDB format
   */
  private transformAbout(sanityAbout: any): any {
    return {
      allowLightHeading: sanityAbout.allowLightHeading || '',
      allowUsHeading: sanityAbout.allowUsHeading || '',
      allowRightHeading: sanityAbout.allowRightHeading || '',
      paragraph: this.portableTextToHTML(sanityAbout.paragraph),
      anchorLinks: (sanityAbout.anchorLinks || []).map((link: any) => ({
        label: link.label || '',
        targetId: link.targetId || '',
      })),
      sections: (sanityAbout.sections || []).map((section: any) => ({
        sectionId: section.sectionId || '',
        title: section.title || '',
        body: section.body || '',
        image: {
          url: this.extractImageUrl(section.image) || '',
          darkModeUrl: this.extractImageUrl(section.imageDarkMode) || '',
        },
      })),
      seoTitle: sanityAbout.seoTitle || 'About Us',
      seoDescription: sanityAbout.seoDescription || '',
    };
  }

  /**
   * Transform Sanity Contact page to MongoDB format
   */
  private transformContact(sanityContact: any): any {
    return {
      title: sanityContact.mainHeading || 'Contact Us',
      description: this.portableTextToHTML(sanityContact.introText),
      contactInfo: {
        email: sanityContact.contactInfo?.email || '',
        phone: sanityContact.contactInfo?.phone || '',
        address: sanityContact.contactInfo?.address || '',
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
        },
      },
      seoTitle: sanityContact.seoTitle || 'Contact Us',
      seoDescription: sanityContact.seoDescription || '',
    };
  }

  /**
   * Download image from URL
   */
  private async downloadImage(url: string): Promise<Buffer | null> {
    try {
      this.logger.debug(`Downloading image from: ${url}`);
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 second timeout
      });
      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error(`Failed to download image from ${url}:`, error);
      this.stats.images.failed++;
      this.stats.errors.push({
        type: 'IMAGE_DOWNLOAD',
        message: `Failed to download image from ${url}`,
        details: error,
      });
      return null;
    }
  }

  /**
   * Migrate a single image from Sanity to S3
   */
  private async migrateImage(
    sanityImageUrl: string,
    folder: string,
    imageName: string
  ): Promise<string | null> {
    if (!sanityImageUrl) {
      return null;
    }

    if (this.config.dryRun) {
      this.logger.debug(`[DRY RUN] Would migrate image: ${sanityImageUrl} to ${folder}/${imageName}`);
      return sanityImageUrl; // Return original URL in dry run
    }

    try {
      // Download image from Sanity CDN
      const imageBuffer = await this.downloadImage(sanityImageUrl);
      if (!imageBuffer) {
        return null;
      }

      // Upload to S3
      const result = await uploadImageToS3({
        buffer: imageBuffer,
        originalName: imageName,
        folder,
      });

      this.stats.images.success++;
      this.logger.debug(`Migrated image to: ${result.cdnUrl}`);
      return result.cdnUrl;
    } catch (error) {
      this.logger.error(`Failed to migrate image ${sanityImageUrl}:`, error);
      this.stats.images.failed++;
      this.stats.errors.push({
        type: 'IMAGE_MIGRATION',
        message: `Failed to migrate image ${sanityImageUrl}`,
        details: error,
      });
      return null;
    }
  }

  /**
   * Migrate project images
   */
  private async migrateProjectImages(project: any, projectSlug: string): Promise<any> {
    const migratedImages = [];

    if (project.images && Array.isArray(project.images)) {
      for (let i = 0; i < project.images.length; i++) {
        const image = project.images[i];
        if (image.url) {
          const migratedUrl = await this.migrateImage(
            image.url,
            `projects/${projectSlug}`,
            `image-${i + 1}.jpg`
          );

          if (migratedUrl) {
            migratedImages.push({
              ...image,
              url: migratedUrl,
            });
          }
        }
      }
    }

    return {
      ...project,
      images: migratedImages,
    };
  }

  /**
   * Migrate service images
   */
  private async migrateServiceImages(service: any, serviceSlug: string): Promise<any> {
    const migratedService = { ...service };

    // Migrate banner image
    if (service.bannerImage?.url) {
      const migratedUrl = await this.migrateImage(
        service.bannerImage.url,
        `services/${serviceSlug}`,
        'banner.jpg'
      );
      if (migratedUrl) {
        migratedService.bannerImage.url = migratedUrl;
      }
    }

    // Migrate banner dark mode image
    if (service.bannerImage?.darkModeUrl) {
      const migratedUrl = await this.migrateImage(
        service.bannerImage.darkModeUrl,
        `services/${serviceSlug}`,
        'banner-dark.jpg'
      );
      if (migratedUrl) {
        migratedService.bannerImage.darkModeUrl = migratedUrl;
      }
    }

    // Migrate main image
    if (service.image?.url) {
      const migratedUrl = await this.migrateImage(
        service.image.url,
        `services/${serviceSlug}`,
        'main.jpg'
      );
      if (migratedUrl) {
        migratedService.image.url = migratedUrl;
      }
    }

    // Migrate main dark mode image
    if (service.image?.darkModeUrl) {
      const migratedUrl = await this.migrateImage(
        service.image.darkModeUrl,
        `services/${serviceSlug}`,
        'main-dark.jpg'
      );
      if (migratedUrl) {
        migratedService.image.darkModeUrl = migratedUrl;
      }
    }

    return migratedService;
  }

  /**
   * Migrate FAQ images
   */
  private async migrateFAQImages(faq: any): Promise<any> {
    const migratedFAQ = { ...faq };

    if (migratedFAQ.categories && Array.isArray(migratedFAQ.categories)) {
      for (let i = 0; i < migratedFAQ.categories.length; i++) {
        const category = migratedFAQ.categories[i];
        const categorySlug = this.generateSlug(category.title || `category-${i + 1}`);

        // Migrate category image
        if (category.image?.url) {
          const migratedUrl = await this.migrateImage(
            category.image.url,
            `faq/${categorySlug}`,
            'image.jpg'
          );
          if (migratedUrl) {
            migratedFAQ.categories[i].image.url = migratedUrl;
          }
        }

        // Migrate category dark mode image
        if (category.image?.darkModeUrl) {
          const migratedUrl = await this.migrateImage(
            category.image.darkModeUrl,
            `faq/${categorySlug}`,
            'image-dark.jpg'
          );
          if (migratedUrl) {
            migratedFAQ.categories[i].image.darkModeUrl = migratedUrl;
          }
        }
      }
    }

    return migratedFAQ;
  }

  /**
   * Migrate About page images
   */
  private async migrateAboutImages(about: any): Promise<any> {
    const migratedAbout = { ...about };

    if (migratedAbout.sections && Array.isArray(migratedAbout.sections)) {
      for (let i = 0; i < migratedAbout.sections.length; i++) {
        const section = migratedAbout.sections[i];
        const sectionId = section.sectionId || `section-${i + 1}`;

        // Migrate section image
        if (section.image?.url) {
          const migratedUrl = await this.migrateImage(
            section.image.url,
            `about/${sectionId}`,
            'image.jpg'
          );
          if (migratedUrl) {
            migratedAbout.sections[i].image.url = migratedUrl;
          }
        }

        // Migrate section dark mode image
        if (section.image?.darkModeUrl) {
          const migratedUrl = await this.migrateImage(
            section.image.darkModeUrl,
            `about/${sectionId}`,
            'image-dark.jpg'
          );
          if (migratedUrl) {
            migratedAbout.sections[i].image.darkModeUrl = migratedUrl;
          }
        }
      }
    }

    return migratedAbout;
  }

  /**
   * Migrate services - Complete implementation
   */
  private async migrateServices(): Promise<void> {
    const sanityServices = await this.fetchServicesFromSanity();
    this.logger.info(`Found ${sanityServices.length} services to migrate`);

    for (let i = 0; i < sanityServices.length; i++) {
      const sanityService = sanityServices[i];
      
      try {
        // Transform service data
        const transformedService = this.transformService(sanityService, i);
        
        this.logger.debug(`Processing service: ${transformedService.title}`);

        // Migrate images
        const serviceWithImages = await this.migrateServiceImages(
          transformedService,
          transformedService.slug
        );

        if (this.config.dryRun) {
          this.logger.info(`[DRY RUN] Would insert service: ${serviceWithImages.title}`);
          this.stats.services.success++;
          continue;
        }

        // Check if service already exists
        const existingService = await Service.findOne({ slug: serviceWithImages.slug });

        if (existingService) {
          // Update existing service
          await Service.findByIdAndUpdate(existingService._id, serviceWithImages);
          this.logger.success(`Updated service: ${serviceWithImages.title}`);
          this.stats.services.skipped++;
        } else {
          // Insert new service
          await Service.create(serviceWithImages);
          this.logger.success(`Inserted service: ${serviceWithImages.title}`);
          this.stats.services.success++;
        }
      } catch (error) {
        this.logger.error(`Failed to migrate service ${i + 1}:`, error);
        this.stats.services.failed++;
        this.stats.errors.push({
          type: 'SERVICE_MIGRATION',
          message: `Failed to migrate service: ${sanityService.title || `Service ${i + 1}`}`,
          details: error,
        });
      }
    }
  }

  /**
   * Migrate FAQ - Complete implementation
   */
  private async migrateFAQ(): Promise<void> {
    const sanityFAQ = await this.fetchFAQFromSanity();
    
    if (!sanityFAQ) {
      this.logger.warn('No FAQ found to migrate');
      return;
    }

    try {
      // Transform FAQ data
      const transformedFAQ = this.transformFAQ(sanityFAQ);
      
      this.logger.debug('Processing FAQ');

      // Migrate images
      const faqWithImages = await this.migrateFAQImages(transformedFAQ);

      if (this.config.dryRun) {
        this.logger.info('[DRY RUN] Would insert/update FAQ');
        this.stats.faq.success++;
        return;
      }

      // FAQ is a singleton - check if it exists
      const existingFAQ = await FAQ.findOne();

      if (existingFAQ) {
        // Update existing FAQ
        await FAQ.findByIdAndUpdate(existingFAQ._id, faqWithImages);
        this.logger.success('Updated FAQ');
        this.stats.faq.skipped++;
      } else {
        // Insert new FAQ
        await FAQ.create(faqWithImages);
        this.logger.success('Inserted FAQ');
        this.stats.faq.success++;
      }
    } catch (error) {
      this.logger.error('Failed to migrate FAQ:', error);
      this.stats.faq.failed++;
      this.stats.errors.push({
        type: 'FAQ_MIGRATION',
        message: 'Failed to migrate FAQ',
        details: error,
      });
    }
  }

  /**
   * Migrate About page - Complete implementation
   */
  private async migrateAbout(): Promise<void> {
    const sanityAbout = await this.fetchAboutFromSanity();
    
    if (!sanityAbout) {
      this.logger.warn('No About page found to migrate');
      return;
    }

    try {
      // Transform About data
      const transformedAbout = this.transformAbout(sanityAbout);
      
      this.logger.debug('Processing About page');

      // Migrate images
      const aboutWithImages = await this.migrateAboutImages(transformedAbout);

      if (this.config.dryRun) {
        this.logger.info('[DRY RUN] Would insert/update About page');
        this.stats.about.success++;
        return;
      }

      // About is a singleton - check if it exists
      const existingAbout = await About.findOne();

      if (existingAbout) {
        // Update existing About page
        await About.findByIdAndUpdate(existingAbout._id, aboutWithImages);
        this.logger.success('Updated About page');
        this.stats.about.skipped++;
      } else {
        // Insert new About page
        await About.create(aboutWithImages);
        this.logger.success('Inserted About page');
        this.stats.about.success++;
      }
    } catch (error) {
      this.logger.error('Failed to migrate About page:', error);
      this.stats.about.failed++;
      this.stats.errors.push({
        type: 'ABOUT_MIGRATION',
        message: 'Failed to migrate About page',
        details: error,
      });
    }
  }

  /**
   * Migrate Contact page - Complete implementation
   */
  private async migrateContact(): Promise<void> {
    const sanityContact = await this.fetchContactFromSanity();
    
    if (!sanityContact) {
      this.logger.warn('No Contact page found to migrate');
      return;
    }

    try {
      // Transform Contact data
      const transformedContact = this.transformContact(sanityContact);
      
      this.logger.debug('Processing Contact page');

      if (this.config.dryRun) {
        this.logger.info('[DRY RUN] Would insert/update Contact page');
        this.stats.contact.success++;
        return;
      }

      // Contact is a singleton - check if it exists
      const existingContact = await Contact.findOne();

      if (existingContact) {
        // Update existing Contact page
        await Contact.findByIdAndUpdate(existingContact._id, transformedContact);
        this.logger.success('Updated Contact page');
        this.stats.contact.skipped++;
      } else {
        // Insert new Contact page
        await Contact.create(transformedContact);
        this.logger.success('Inserted Contact page');
        this.stats.contact.success++;
      }
    } catch (error) {
      this.logger.error('Failed to migrate Contact page:', error);
      this.stats.contact.failed++;
      this.stats.errors.push({
        type: 'CONTACT_MIGRATION',
        message: 'Failed to migrate Contact page',
        details: error,
      });
    }
  }

  /**
   * Generate migration report
   */
  private generateReport(): void {
    this.logger.section('Migration Report');

    console.log('Projects:');
    console.log(`  ✓ Success: ${this.stats.projects.success}`);
    console.log(`  ✗ Failed:  ${this.stats.projects.failed}`);
    console.log(`  ⊘ Skipped: ${this.stats.projects.skipped}`);

    console.log('\nServices:');
    console.log(`  ✓ Success: ${this.stats.services.success}`);
    console.log(`  ✗ Failed:  ${this.stats.services.failed}`);
    console.log(`  ⊘ Skipped: ${this.stats.services.skipped}`);

    console.log('\nFAQ:');
    console.log(`  ✓ Success: ${this.stats.faq.success}`);
    console.log(`  ✗ Failed:  ${this.stats.faq.failed}`);
    console.log(`  ⊘ Skipped: ${this.stats.faq.skipped}`);

    console.log('\nAbout Page:');
    console.log(`  ✓ Success: ${this.stats.about.success}`);
    console.log(`  ✗ Failed:  ${this.stats.about.failed}`);
    console.log(`  ⊘ Skipped: ${this.stats.about.skipped}`);

    console.log('\nContact Page:');
    console.log(`  ✓ Success: ${this.stats.contact.success}`);
    console.log(`  ✗ Failed:  ${this.stats.contact.failed}`);
    console.log(`  ⊘ Skipped: ${this.stats.contact.skipped}`);

    console.log('\nImages:');
    console.log(`  ✓ Success: ${this.stats.images.success}`);
    console.log(`  ✗ Failed:  ${this.stats.images.failed}`);

    if (this.stats.errors.length > 0) {
      console.log('\n⚠ Errors:');
      this.stats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.type}] ${error.message}`);
        if (error.details && this.config.verbose) {
          console.log(`     Details:`, error.details);
        }
      });
    }

    const totalSuccess =
      this.stats.projects.success +
      this.stats.services.success +
      this.stats.faq.success +
      this.stats.about.success +
      this.stats.contact.success;

    const totalFailed =
      this.stats.projects.failed +
      this.stats.services.failed +
      this.stats.faq.failed +
      this.stats.about.failed +
      this.stats.contact.failed;

    console.log('\n' + '='.repeat(60));
    console.log(`Total: ${totalSuccess} successful, ${totalFailed} failed`);
    console.log('='.repeat(60));
  }
}

/**
 * Parse command-line arguments
 */
function parseArgs(): MigrationConfig {
  const args = process.argv.slice(2);
  const config: MigrationConfig = {
    dryRun: false,
    verbose: false,
  };

  for (const arg of args) {
    switch (arg) {
      case '--dry-run':
      case '-d':
        config.dryRun = true;
        break;
      case '--verbose':
      case '-v':
        config.verbose = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        showHelp();
        process.exit(1);
    }
  }

  return config;
}

/**
 * Show help message
 */
function showHelp(): void {
  console.log(`
Sanity to MongoDB Migration Script

Usage:
  npm run migrate [options]

Options:
  --dry-run, -d    Preview migration without making changes
  --verbose, -v    Show detailed logging
  --help, -h       Show this help message

Examples:
  npm run migrate                    # Run full migration
  npm run migrate -- --dry-run       # Preview migration
  npm run migrate -- --verbose       # Run with detailed logging
  npm run migrate -- -d -v           # Dry run with verbose logging

Environment Variables Required:
  MONGODB_URI           MongoDB connection string
  SANITY_PROJECT_ID     Sanity project ID
  SANITY_DATASET        Sanity dataset name
  SANITY_API_TOKEN      Sanity API token (with read permissions)
  AWS_ACCESS_KEY_ID     AWS access key for S3
  AWS_SECRET_ACCESS_KEY AWS secret key for S3
  AWS_BUCKET_NAME       S3 bucket name for images
  AWS_REGION            AWS region
  `);
}

/**
 * Main entry point
 */
async function main() {
  const config = parseArgs();
  const migration = new SanityToMongoMigration(config);
  await migration.run();
}

// Run migration if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { SanityToMongoMigration, MigrationConfig, MigrationStats };
