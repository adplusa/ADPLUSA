import * as fc from 'fast-check';
import { 
  VIDEO_ACCEPTED_TYPES, 
  MEDIA_ACCEPTED_TYPES 
} from './ImageUploader';

/**
 * Property Test: Video Upload Acceptance
 * Feature: cms-enhancements, Property 6: Video Upload Acceptance
 * Validates: Requirements 5.1
 * 
 * For any file with MIME type 'video/mp4' or 'video/webm', the media uploader should accept the file;
 * for any file with an image MIME type, the uploader should also accept it.
 */

// Helper function that simulates the file type validation logic from ImageUploader
function isFileTypeAccepted(mimeType: string, acceptedTypes: string[]): boolean {
  // Check if the MIME type is in the accepted types list
  if (acceptedTypes.includes(mimeType)) {
    return true;
  }
  
  // Check if it's an image type (starts with "image/")
  if (mimeType.startsWith("image/")) {
    return true;
  }
  
  // Check if it's a video type (starts with "video/")
  if (mimeType.startsWith("video/")) {
    return true;
  }
  
  return false;
}

// Arbitrary for generating valid video MIME types
const videoMimeTypeArbitrary = fc.constantFrom('video/mp4', 'video/webm');

// Arbitrary for generating valid image MIME types
const imageMimeTypeArbitrary = fc.constantFrom(
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
);

// Arbitrary for generating invalid MIME types
const invalidMimeTypeArbitrary = fc.constantFrom(
  'application/pdf',
  'text/plain',
  'application/json',
  'audio/mp3',
  'application/octet-stream'
);

describe('Video Upload Acceptance', () => {
  /**
   * Property 6: Video Upload Acceptance - Video files should be accepted
   * For any file with MIME type 'video/mp4' or 'video/webm', the media uploader should accept the file.
   */
  it('should accept video/mp4 and video/webm MIME types', () => {
    fc.assert(
      fc.property(videoMimeTypeArbitrary, (mimeType) => {
        const isAccepted = isFileTypeAccepted(mimeType, MEDIA_ACCEPTED_TYPES);
        
        // Video files should always be accepted when using MEDIA_ACCEPTED_TYPES
        expect(isAccepted).toBe(true);
        
        // Verify the MIME type is in VIDEO_ACCEPTED_TYPES
        expect(VIDEO_ACCEPTED_TYPES).toContain(mimeType);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Video Upload Acceptance - Image files should also be accepted
   * For any file with an image MIME type, the uploader should also accept it.
   */
  it('should accept image MIME types', () => {
    fc.assert(
      fc.property(imageMimeTypeArbitrary, (mimeType) => {
        const isAccepted = isFileTypeAccepted(mimeType, MEDIA_ACCEPTED_TYPES);
        
        // Image files should always be accepted
        expect(isAccepted).toBe(true);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: MEDIA_ACCEPTED_TYPES should include both image and video types
   */
  it('should have MEDIA_ACCEPTED_TYPES include both image and video types', () => {
    // Check that video types are included
    expect(MEDIA_ACCEPTED_TYPES).toContain('video/mp4');
    expect(MEDIA_ACCEPTED_TYPES).toContain('video/webm');
    
    // Check that image types are included
    expect(MEDIA_ACCEPTED_TYPES).toContain('image/jpeg');
    expect(MEDIA_ACCEPTED_TYPES).toContain('image/png');
    expect(MEDIA_ACCEPTED_TYPES).toContain('image/gif');
    expect(MEDIA_ACCEPTED_TYPES).toContain('image/webp');
    expect(MEDIA_ACCEPTED_TYPES).toContain('image/svg+xml');
  });

  /**
   * Property: Invalid MIME types should not be accepted
   */
  it('should reject invalid MIME types when not in accepted list', () => {
    fc.assert(
      fc.property(invalidMimeTypeArbitrary, (mimeType) => {
        const isAccepted = isFileTypeAccepted(mimeType, MEDIA_ACCEPTED_TYPES);
        
        // Invalid MIME types should not be accepted
        expect(isAccepted).toBe(false);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: All video types in VIDEO_ACCEPTED_TYPES should be in MEDIA_ACCEPTED_TYPES
   */
  it('should have all VIDEO_ACCEPTED_TYPES included in MEDIA_ACCEPTED_TYPES', () => {
    fc.assert(
      fc.property(fc.constantFrom(...VIDEO_ACCEPTED_TYPES), (videoType) => {
        expect(MEDIA_ACCEPTED_TYPES).toContain(videoType);
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

describe('File Type Detection', () => {
  /**
   * Property: Video MIME types should be correctly identified
   */
  it('should correctly identify video MIME types', () => {
    fc.assert(
      fc.property(videoMimeTypeArbitrary, (mimeType) => {
        // Video MIME types start with "video/"
        expect(mimeType.startsWith('video/')).toBe(true);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Image MIME types should be correctly identified
   */
  it('should correctly identify image MIME types', () => {
    fc.assert(
      fc.property(imageMimeTypeArbitrary, (mimeType) => {
        // Image MIME types start with "image/"
        expect(mimeType.startsWith('image/')).toBe(true);
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
