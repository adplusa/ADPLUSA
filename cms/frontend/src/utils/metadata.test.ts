import * as fc from 'fast-check';

/**
 * Property Test: Metadata Generation with Fallbacks
 * Feature: cms-enhancements, Property 2: Metadata Generation with Fallbacks
 * Validates: Requirements 2.3, 2.4
 * 
 * For any page configuration, if SEO values are provided they should be used in metadata generation;
 * if SEO values are missing or empty, default fallback values should be used instead.
 */

// Default fallback values (matching the actual implementation)
const DEFAULT_TITLE = "Our Projects | ADPL Consulting";
const DEFAULT_DESCRIPTION = "Explore our portfolio of completed projects at ADPL Consulting";

// Type definitions matching cms-types.ts
interface MetaTag {
  name: string;
  content: string;
}

interface ProjectsPageData {
  seoTitle?: string;
  seoDescription?: string;
  metaTags?: MetaTag[];
  pageTitle?: string;
  pageSubtitle?: string;
  heading?: string;
}

interface GeneratedMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
  };
  robots: {
    index: boolean;
    follow: boolean;
  };
  other?: Record<string, string>;
}

/**
 * Pure function that generates metadata from page data
 * This mirrors the logic in projects/page.js generateMetadata function
 */
function generateMetadataFromPageData(pageData: ProjectsPageData | null): GeneratedMetadata {
  // Use CMS values if available, otherwise use defaults
  const title = pageData?.seoTitle || DEFAULT_TITLE;
  const description = pageData?.seoDescription || DEFAULT_DESCRIPTION;
  
  // Build metadata object
  const metadata: GeneratedMetadata = {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
  
  // Generate meta tags from structured metaTags array
  if (pageData?.metaTags && pageData.metaTags.length > 0) {
    metadata.other = pageData.metaTags.reduce((acc, tag) => {
      if (tag.name && tag.content) {
        acc[tag.name] = tag.content;
      }
      return acc;
    }, {} as Record<string, string>);
  }
  
  return metadata;
}

// Arbitraries for generating test data
// Reserved property names that shouldn't be used as meta tag names
const RESERVED_NAMES = ['__proto__', 'constructor', 'prototype', 'toString', 'valueOf', 'hasOwnProperty'];

const metaTagArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0 && !RESERVED_NAMES.includes(s)),
  content: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
});

const metaTagArrayArbitrary = fc.array(metaTagArbitrary, { minLength: 0, maxLength: 10 });

const nonEmptyStringArbitrary = fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0);

const pageDataArbitrary = fc.record({
  seoTitle: fc.option(nonEmptyStringArbitrary, { nil: undefined }),
  seoDescription: fc.option(nonEmptyStringArbitrary, { nil: undefined }),
  metaTags: fc.option(metaTagArrayArbitrary, { nil: undefined }),
  pageTitle: fc.option(nonEmptyStringArbitrary, { nil: undefined }),
  pageSubtitle: fc.option(nonEmptyStringArbitrary, { nil: undefined }),
  heading: fc.option(nonEmptyStringArbitrary, { nil: undefined }),
});

describe('Metadata Generation with Fallbacks', () => {
  /**
   * Property 2: When SEO values are provided, they should be used
   * Validates: Requirements 2.3
   */
  it('should use provided SEO values when available', () => {
    fc.assert(
      fc.property(nonEmptyStringArbitrary, nonEmptyStringArbitrary, (title, description) => {
        const pageData: ProjectsPageData = {
          seoTitle: title,
          seoDescription: description,
        };
        
        const metadata = generateMetadataFromPageData(pageData);
        
        // Should use the provided values
        expect(metadata.title).toBe(title);
        expect(metadata.description).toBe(description);
        expect(metadata.openGraph.title).toBe(title);
        expect(metadata.openGraph.description).toBe(description);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: When SEO values are missing, fallback values should be used
   * Validates: Requirements 2.4
   */
  it('should use default fallback values when SEO values are missing', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const metadata = generateMetadataFromPageData(null);
        
        // Should use default fallback values
        expect(metadata.title).toBe(DEFAULT_TITLE);
        expect(metadata.description).toBe(DEFAULT_DESCRIPTION);
        expect(metadata.openGraph.title).toBe(DEFAULT_TITLE);
        expect(metadata.openGraph.description).toBe(DEFAULT_DESCRIPTION);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: When SEO values are empty strings, fallback values should be used
   * Validates: Requirements 2.4
   */
  it('should use default fallback values when SEO values are empty strings', () => {
    const pageData: ProjectsPageData = {
      seoTitle: '',
      seoDescription: '',
    };
    
    const metadata = generateMetadataFromPageData(pageData);
    
    // Empty strings are falsy, so defaults should be used
    expect(metadata.title).toBe(DEFAULT_TITLE);
    expect(metadata.description).toBe(DEFAULT_DESCRIPTION);
  });

  /**
   * Property 2: Partial SEO values - title provided, description missing
   */
  it('should handle partial SEO values correctly', () => {
    fc.assert(
      fc.property(nonEmptyStringArbitrary, (title) => {
        const pageData: ProjectsPageData = {
          seoTitle: title,
          // seoDescription is missing
        };
        
        const metadata = generateMetadataFromPageData(pageData);
        
        // Title should use provided value
        expect(metadata.title).toBe(title);
        // Description should use fallback
        expect(metadata.description).toBe(DEFAULT_DESCRIPTION);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Meta tags should be included in metadata.other when provided
   */
  it('should include meta tags in metadata.other when provided', () => {
    fc.assert(
      fc.property(metaTagArrayArbitrary, (metaTags) => {
        const pageData: ProjectsPageData = {
          metaTags,
        };
        
        const metadata = generateMetadataFromPageData(pageData);
        
        // Filter valid tags
        const validTags = metaTags.filter(t => t.name && t.content);
        
        if (validTags.length > 0) {
          expect(metadata.other).toBeDefined();
          
          // Each valid tag should be in metadata.other
          for (const tag of validTags) {
            expect(metadata.other![tag.name]).toBe(tag.content);
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: metadata.other should not be set when no meta tags are provided
   */
  it('should not set metadata.other when no meta tags are provided', () => {
    const pageData: ProjectsPageData = {
      seoTitle: 'Test Title',
      seoDescription: 'Test Description',
      // metaTags is not provided
    };
    
    const metadata = generateMetadataFromPageData(pageData);
    
    expect(metadata.other).toBeUndefined();
  });

  /**
   * Property 2: metadata.other should not be set when meta tags array is empty
   */
  it('should not set metadata.other when meta tags array is empty', () => {
    const pageData: ProjectsPageData = {
      seoTitle: 'Test Title',
      seoDescription: 'Test Description',
      metaTags: [],
    };
    
    const metadata = generateMetadataFromPageData(pageData);
    
    expect(metadata.other).toBeUndefined();
  });

  /**
   * Property 2: robots should always be set to index and follow
   */
  it('should always set robots to index and follow', () => {
    fc.assert(
      fc.property(pageDataArbitrary, (pageData) => {
        const metadata = generateMetadataFromPageData(pageData);
        
        expect(metadata.robots.index).toBe(true);
        expect(metadata.robots.follow).toBe(true);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: openGraph values should match title and description
   */
  it('should set openGraph values to match title and description', () => {
    fc.assert(
      fc.property(pageDataArbitrary, (pageData) => {
        const metadata = generateMetadataFromPageData(pageData);
        
        // openGraph should always match the main title and description
        expect(metadata.openGraph.title).toBe(metadata.title);
        expect(metadata.openGraph.description).toBe(metadata.description);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
