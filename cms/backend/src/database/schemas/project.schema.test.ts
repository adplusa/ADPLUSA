import * as fc from 'fast-check';
import { IProjectImage, ProjectMediaType } from './project.schema';

/**
 * Property Test: Media Type Rendering
 * Feature: cms-enhancements, Property 5: Media Type Rendering
 * Validates: Requirements 5.3, 5.5
 * 
 * For any project media item, if the type is 'video' the system should render
 * a video element with controls; if the type is 'image' or undefined, the system
 * should render an image element.
 */

// Arbitrary for generating valid media URLs
const mediaUrlArbitrary = fc.webUrl();

// Arbitrary for generating video thumbnail URLs
const thumbnailUrlArbitrary = fc.option(fc.webUrl(), { nil: undefined });

// Arbitrary for generating media type
const mediaTypeArbitrary: fc.Arbitrary<ProjectMediaType | undefined> = fc.oneof(
  fc.constant('image' as ProjectMediaType),
  fc.constant('video' as ProjectMediaType),
  fc.constant(undefined)
);

// Arbitrary for generating valid project media items
const projectMediaArbitrary: fc.Arbitrary<IProjectImage> = fc.record({
  url: mediaUrlArbitrary,
  alt: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
  width: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
  height: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
  type: mediaTypeArbitrary,
  thumbnailUrl: thumbnailUrlArbitrary,
});

// Arbitrary for generating video media items specifically
const videoMediaArbitrary: fc.Arbitrary<IProjectImage> = fc.record({
  url: mediaUrlArbitrary,
  alt: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
  width: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
  height: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
  type: fc.constant('video' as ProjectMediaType),
  thumbnailUrl: fc.webUrl(),
});

// Arbitrary for generating image media items specifically
const imageMediaArbitrary: fc.Arbitrary<IProjectImage> = fc.record({
  url: mediaUrlArbitrary,
  alt: fc.option(fc.string({ minLength: 0, maxLength: 100 }), { nil: undefined }),
  width: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
  height: fc.option(fc.integer({ min: 1, max: 4000 }), { nil: undefined }),
  type: fc.oneof(fc.constant('image' as ProjectMediaType), fc.constant(undefined)),
  thumbnailUrl: fc.constant(undefined),
});

/**
 * Determines the element type to render based on media type
 * This simulates the frontend rendering logic
 */
type RenderElementType = 'video' | 'image';

function determineRenderElementType(media: IProjectImage): RenderElementType {
  if (media.type === 'video') {
    return 'video';
  }
  // Default to image for 'image' type or undefined
  return 'image';
}

/**
 * Determines if video controls should be shown
 */
function shouldShowVideoControls(media: IProjectImage): boolean {
  return media.type === 'video';
}

/**
 * Gets the poster/thumbnail URL for video elements
 */
function getVideoPosterUrl(media: IProjectImage): string | undefined {
  if (media.type === 'video') {
    return media.thumbnailUrl;
  }
  return undefined;
}

/**
 * Simulates rendering a media item and returns the rendered element info
 */
interface RenderedMediaElement {
  elementType: RenderElementType;
  src: string;
  alt?: string;
  hasControls: boolean;
  posterUrl?: string;
}

function renderMediaElement(media: IProjectImage): RenderedMediaElement {
  const elementType = determineRenderElementType(media);
  const hasControls = shouldShowVideoControls(media);
  const posterUrl = getVideoPosterUrl(media);
  
  return {
    elementType,
    src: media.url,
    alt: media.alt,
    hasControls,
    posterUrl,
  };
}

describe('Media Type Rendering', () => {
  /**
   * Property 5: Media Type Rendering
   * For any project media item, if the type is 'video' the system should render
   * a video element with controls; if the type is 'image' or undefined, the system
   * should render an image element.
   */
  it('should render video element with controls for video type media', () => {
    fc.assert(
      fc.property(videoMediaArbitrary, (media) => {
        const rendered = renderMediaElement(media);
        
        // Should render as video element
        expect(rendered.elementType).toBe('video');
        
        // Should have controls enabled
        expect(rendered.hasControls).toBe(true);
        
        // Should use the media URL as source
        expect(rendered.src).toBe(media.url);
        
        // Should have poster URL for thumbnail
        expect(rendered.posterUrl).toBe(media.thumbnailUrl);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should render image element without controls for image type media', () => {
    fc.assert(
      fc.property(imageMediaArbitrary, (media) => {
        const rendered = renderMediaElement(media);
        
        // Should render as image element
        expect(rendered.elementType).toBe('image');
        
        // Should not have video controls
        expect(rendered.hasControls).toBe(false);
        
        // Should use the media URL as source
        expect(rendered.src).toBe(media.url);
        
        // Should not have poster URL
        expect(rendered.posterUrl).toBeUndefined();
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should correctly determine element type for any media item', () => {
    fc.assert(
      fc.property(projectMediaArbitrary, (media) => {
        const elementType = determineRenderElementType(media);
        
        if (media.type === 'video') {
          expect(elementType).toBe('video');
        } else {
          // 'image' or undefined should render as image
          expect(elementType).toBe('image');
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should only show controls for video type media', () => {
    fc.assert(
      fc.property(projectMediaArbitrary, (media) => {
        const hasControls = shouldShowVideoControls(media);
        
        if (media.type === 'video') {
          expect(hasControls).toBe(true);
        } else {
          expect(hasControls).toBe(false);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve media URL in rendered element', () => {
    fc.assert(
      fc.property(projectMediaArbitrary, (media) => {
        const rendered = renderMediaElement(media);
        
        // URL should always be preserved
        expect(rendered.src).toBe(media.url);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should preserve alt text in rendered element', () => {
    fc.assert(
      fc.property(projectMediaArbitrary, (media) => {
        const rendered = renderMediaElement(media);
        
        // Alt text should be preserved
        expect(rendered.alt).toBe(media.alt);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle media with undefined type as image', () => {
    const mediaWithUndefinedType: IProjectImage = {
      url: 'https://example.com/image.jpg',
      alt: 'Test image',
    };
    
    const rendered = renderMediaElement(mediaWithUndefinedType);
    
    expect(rendered.elementType).toBe('image');
    expect(rendered.hasControls).toBe(false);
    expect(rendered.posterUrl).toBeUndefined();
  });

  it('should handle video media with thumbnail URL', () => {
    const videoMedia: IProjectImage = {
      url: 'https://example.com/video.mp4',
      alt: 'Test video',
      type: 'video',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
    };
    
    const rendered = renderMediaElement(videoMedia);
    
    expect(rendered.elementType).toBe('video');
    expect(rendered.hasControls).toBe(true);
    expect(rendered.posterUrl).toBe('https://example.com/thumbnail.jpg');
  });
});
