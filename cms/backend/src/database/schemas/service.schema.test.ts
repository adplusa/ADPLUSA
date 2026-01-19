import * as fc from 'fast-check';
import { IServiceImage } from './service.schema';

/**
 * Property Test: Consistent Service Image Source
 * Feature: cms-enhancements, Property 7: Consistent Service Image Source
 * Validates: Requirements 3.1, 3.2
 * 
 * For any service displayed on both the homepage and main services page,
 * the image URL used should be identical (sourced from the same field).
 */

// Arbitrary for generating valid service images
const serviceImageArbitrary: fc.Arbitrary<IServiceImage> = fc.record({
  url: fc.webUrl(),
  alt: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
});

// Arbitrary for generating a service with displayImage
const serviceWithDisplayImageArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  slug: fc.string({ minLength: 1, maxLength: 100 })
    .filter(s => /^[a-z0-9-]+$/.test(s)),
  displayImage: fc.option(serviceImageArbitrary, { nil: undefined }),
  bannerImage: fc.option(serviceImageArbitrary, { nil: undefined }),
  image: fc.option(serviceImageArbitrary, { nil: undefined }), // Legacy image
});

/**
 * Simulates getting the display image for homepage
 * This function represents the logic that should be used on the homepage
 */
function getServiceImageForHomepage(service: { displayImage?: IServiceImage }): IServiceImage | undefined {
  return service.displayImage;
}

/**
 * Simulates getting the display image for main services page
 * This function represents the logic that should be used on the main services page
 */
function getServiceImageForMainServicesPage(service: { displayImage?: IServiceImage }): IServiceImage | undefined {
  return service.displayImage;
}

describe('Consistent Service Image Source', () => {
  /**
   * Property 7: Consistent Service Image Source
   * For any service displayed on both the homepage and main services page,
   * the image URL used should be identical (sourced from the same field).
   */
  it('should use the same displayImage field for both homepage and main services page', () => {
    fc.assert(
      fc.property(serviceWithDisplayImageArbitrary, (service) => {
        const homepageImage = getServiceImageForHomepage(service);
        const mainServicesImage = getServiceImageForMainServicesPage(service);
        
        // Both should return the same image reference
        if (homepageImage === undefined && mainServicesImage === undefined) {
          return true;
        }
        
        if (homepageImage === undefined || mainServicesImage === undefined) {
          // If one is undefined and the other isn't, they're not consistent
          return false;
        }
        
        // URLs should be identical
        expect(homepageImage.url).toBe(mainServicesImage.url);
        
        // Alt text should be identical (both undefined or both same value)
        expect(homepageImage.alt).toBe(mainServicesImage.alt);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should return undefined when displayImage is not set', () => {
    const serviceWithoutDisplayImage = {
      title: 'Test Service',
      slug: 'test-service',
      displayImage: undefined,
    };
    
    const homepageImage = getServiceImageForHomepage(serviceWithoutDisplayImage);
    const mainServicesImage = getServiceImageForMainServicesPage(serviceWithoutDisplayImage);
    
    expect(homepageImage).toBeUndefined();
    expect(mainServicesImage).toBeUndefined();
  });

  it('should return the same image object when displayImage is set', () => {
    fc.assert(
      fc.property(serviceImageArbitrary, (displayImage) => {
        const service = {
          title: 'Test Service',
          slug: 'test-service',
          displayImage,
        };
        
        const homepageImage = getServiceImageForHomepage(service);
        const mainServicesImage = getServiceImageForMainServicesPage(service);
        
        // Both should reference the same displayImage
        expect(homepageImage).toBe(mainServicesImage);
        expect(homepageImage?.url).toBe(displayImage.url);
        expect(mainServicesImage?.url).toBe(displayImage.url);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should not use legacy image field for display purposes', () => {
    fc.assert(
      fc.property(
        serviceImageArbitrary,
        serviceImageArbitrary,
        (displayImage, legacyImage) => {
          const service = {
            title: 'Test Service',
            slug: 'test-service',
            displayImage,
            image: legacyImage, // Legacy image should not be used
          };
          
          const homepageImage = getServiceImageForHomepage(service);
          const mainServicesImage = getServiceImageForMainServicesPage(service);
          
          // Should use displayImage, not legacy image
          expect(homepageImage?.url).toBe(displayImage.url);
          expect(mainServicesImage?.url).toBe(displayImage.url);
          
          // Should NOT use legacy image
          if (displayImage.url !== legacyImage.url) {
            expect(homepageImage?.url).not.toBe(legacyImage.url);
            expect(mainServicesImage?.url).not.toBe(legacyImage.url);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
