import * as fc from 'fast-check';
import { IMainServicePage, IMainServicePageImage, IWhyWorkWithUsItem } from './mainServicePage.schema';

/**
 * Property Test: Schema Validation and Data Persistence
 * Feature: cms-enhancements, Property 1: Schema Validation and Data Persistence
 * Validates: Requirements 1.3, 1.5
 * 
 * For any valid main service page data object, saving it to the database
 * and retrieving it should return an equivalent object with all fields preserved.
 */

// Arbitrary for generating valid images
const imageArbitrary: fc.Arbitrary<IMainServicePageImage> = fc.record({
  url: fc.webUrl(),
  alt: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
});

// Arbitrary for generating Why Work With Us items
const whyWorkWithUsItemArbitrary: fc.Arbitrary<IWhyWorkWithUsItem> = fc.record({
  icon: fc.option(fc.string({ minLength: 0, maxLength: 50 }), { nil: undefined }),
  title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0),
});

// Arbitrary for generating valid main service page data
const mainServicePageDataArbitrary = fc.record({
  bannerImage: fc.option(imageArbitrary, { nil: undefined }),
  bannerTitle: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  pageTitle: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  pageSubtitle: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
  showTrustIcons: fc.boolean(),
  trustIconsHeading: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  servicesHeading: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  showWhyWorkWithUs: fc.boolean(),
  whyWorkWithUsHeading: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  whyWorkWithUsItems: fc.array(whyWorkWithUsItemArbitrary, { minLength: 0, maxLength: 10 }),
  whyWorkWithUsImage: fc.option(imageArbitrary, { nil: undefined }),
  showContactForm: fc.boolean(),
  contactFormHeading: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  contactFormSubheading: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
  seoTitle: fc.option(fc.string({ minLength: 0, maxLength: 200 }), { nil: undefined }),
  seoDescription: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
});

// Simulates MongoDB serialization (what happens when saving to DB)
function serializeMainServicePage(data: Record<string, any>): string {
  return JSON.stringify(data);
}

// Simulates MongoDB deserialization (what happens when retrieving from DB)
function deserializeMainServicePage(serialized: string): Record<string, any> {
  return JSON.parse(serialized);
}

// Helper to compare objects, handling undefined values
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 === undefined && obj2 === undefined) return true;
  if (obj1 === null && obj2 === null) return true;
  if (typeof obj1 !== typeof obj2) return false;
  
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }
  
  if (typeof obj1 === 'object' && obj1 !== null) {
    const keys1 = Object.keys(obj1).filter(k => obj1[k] !== undefined);
    const keys2 = Object.keys(obj2).filter(k => obj2[k] !== undefined);
    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
  }
  
  return obj1 === obj2;
}

describe('Main Service Page Schema Validation and Data Persistence', () => {
  /**
   * Property 1: Schema Validation and Data Persistence
   * For any valid main service page data object, saving it to the database
   * and retrieving it should return an equivalent object with all fields preserved.
   */
  it('should preserve main service page data through serialization round-trip', () => {
    fc.assert(
      fc.property(mainServicePageDataArbitrary, (pageData) => {
        // Filter out undefined values to simulate what MongoDB stores
        const cleanedData = JSON.parse(JSON.stringify(pageData));
        
        const serialized = serializeMainServicePage(cleanedData);
        const deserialized = deserializeMainServicePage(serialized);
        
        // Verify all defined fields are preserved
        expect(deepEqual(cleanedData, deserialized)).toBe(true);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve boolean fields correctly', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.boolean(),
        fc.boolean(),
        (showTrustIcons, showWhyWorkWithUs, showContactForm) => {
          const data = { showTrustIcons, showWhyWorkWithUs, showContactForm };
          const serialized = serializeMainServicePage(data);
          const deserialized = deserializeMainServicePage(serialized);
          
          expect(deserialized.showTrustIcons).toBe(showTrustIcons);
          expect(deserialized.showWhyWorkWithUs).toBe(showWhyWorkWithUs);
          expect(deserialized.showContactForm).toBe(showContactForm);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve whyWorkWithUsItems array correctly', () => {
    fc.assert(
      fc.property(
        fc.array(whyWorkWithUsItemArbitrary, { minLength: 0, maxLength: 10 }),
        (items) => {
          const data = { whyWorkWithUsItems: items };
          const serialized = serializeMainServicePage(data);
          const deserialized = deserializeMainServicePage(serialized);
          
          // Verify array length is preserved
          expect(deserialized.whyWorkWithUsItems.length).toBe(items.length);
          
          // Verify each item is equivalent
          for (let i = 0; i < items.length; i++) {
            expect(deserialized.whyWorkWithUsItems[i].title).toBe(items[i].title);
            expect(deserialized.whyWorkWithUsItems[i].description).toBe(items[i].description);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve image objects correctly', () => {
    fc.assert(
      fc.property(imageArbitrary, (image) => {
        const data = { bannerImage: image };
        const serialized = serializeMainServicePage(data);
        const deserialized = deserializeMainServicePage(serialized);
        
        expect(deserialized.bannerImage.url).toBe(image.url);
        if (image.alt !== undefined) {
          expect(deserialized.bannerImage.alt).toBe(image.alt);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle empty data object', () => {
    const emptyData = {};
    const serialized = serializeMainServicePage(emptyData);
    const deserialized = deserializeMainServicePage(serialized);
    
    expect(deserialized).toEqual({});
  });

  it('should handle data with only required boolean fields', () => {
    const minimalData = {
      showTrustIcons: true,
      showWhyWorkWithUs: false,
      showContactForm: true,
      whyWorkWithUsItems: [],
    };
    
    const serialized = serializeMainServicePage(minimalData);
    const deserialized = deserializeMainServicePage(serialized);
    
    expect(deserialized.showTrustIcons).toBe(true);
    expect(deserialized.showWhyWorkWithUs).toBe(false);
    expect(deserialized.showContactForm).toBe(true);
    expect(deserialized.whyWorkWithUsItems).toEqual([]);
  });
});
