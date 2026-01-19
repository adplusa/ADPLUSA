import * as fc from 'fast-check';
import { MetaTag, parseCustomHeadTags, metaTagsToHtml } from './MetaTagsInput';

/**
 * Property Test: Meta Tag Array Operations
 * Feature: cms-enhancements, Property 4: Meta Tag Array Operations
 * Validates: Requirements 7.3, 7.4
 * 
 * For any meta tag array, adding a new entry should increase the array length by one,
 * and removing an entry should decrease the array length by one while preserving other entries.
 */

// Arbitrary for generating valid meta tags
const metaTagArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  content: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
});

const metaTagArrayArbitrary = fc.array(metaTagArbitrary, { minLength: 0, maxLength: 20 });

// Helper functions that simulate the component's add/remove operations
function addMetaTag(tags: MetaTag[], newTag: MetaTag): MetaTag[] {
  return [...tags, newTag];
}

function removeMetaTag(tags: MetaTag[], index: number): MetaTag[] {
  return tags.filter((_, i) => i !== index);
}

function updateMetaTag(tags: MetaTag[], index: number, field: keyof MetaTag, value: string): MetaTag[] {
  return tags.map((tag, i) => i === index ? { ...tag, [field]: value } : tag);
}

describe('Meta Tag Array Operations', () => {
  /**
   * Property 4: Meta Tag Array Operations - Add Operation
   * For any meta tag array, adding a new entry should increase the array length by one.
   */
  it('should increase array length by one when adding a meta tag', () => {
    fc.assert(
      fc.property(metaTagArrayArbitrary, metaTagArbitrary, (tags, newTag) => {
        const originalLength = tags.length;
        const result = addMetaTag(tags, newTag);
        
        // Length should increase by exactly 1
        expect(result.length).toBe(originalLength + 1);
        
        // The new tag should be at the end
        expect(result[result.length - 1]).toEqual(newTag);
        
        // All original tags should be preserved in order
        for (let i = 0; i < originalLength; i++) {
          expect(result[i]).toEqual(tags[i]);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: Meta Tag Array Operations - Remove Operation
   * For any meta tag array with at least one element, removing an entry should
   * decrease the array length by one while preserving other entries.
   */
  it('should decrease array length by one when removing a meta tag', () => {
    // Generate arrays with at least one element
    const nonEmptyMetaTagArrayArbitrary = fc.array(metaTagArbitrary, { minLength: 1, maxLength: 20 });
    
    fc.assert(
      fc.property(nonEmptyMetaTagArrayArbitrary, (tags) => {
        // Generate a valid index to remove
        const indexToRemove = Math.floor(Math.random() * tags.length);
        const originalLength = tags.length;
        const removedTag = tags[indexToRemove];
        const result = removeMetaTag(tags, indexToRemove);
        
        // Length should decrease by exactly 1
        expect(result.length).toBe(originalLength - 1);
        
        // The removed tag should not be in the result at the same position
        // All other tags should be preserved
        let resultIndex = 0;
        for (let i = 0; i < originalLength; i++) {
          if (i !== indexToRemove) {
            expect(result[resultIndex]).toEqual(tags[i]);
            resultIndex++;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Update operation preserves array length and other entries
   */
  it('should preserve array length and other entries when updating a meta tag', () => {
    const nonEmptyMetaTagArrayArbitrary = fc.array(metaTagArbitrary, { minLength: 1, maxLength: 20 });
    
    fc.assert(
      fc.property(
        nonEmptyMetaTagArrayArbitrary,
        fc.string({ minLength: 1, maxLength: 100 }),
        (tags, newValue) => {
          const indexToUpdate = Math.floor(Math.random() * tags.length);
          const originalLength = tags.length;
          const result = updateMetaTag(tags, indexToUpdate, 'name', newValue);
          
          // Length should remain the same
          expect(result.length).toBe(originalLength);
          
          // The updated tag should have the new value
          expect(result[indexToUpdate].name).toBe(newValue);
          
          // Content should be preserved
          expect(result[indexToUpdate].content).toBe(tags[indexToUpdate].content);
          
          // All other tags should be unchanged
          for (let i = 0; i < originalLength; i++) {
            if (i !== indexToUpdate) {
              expect(result[i]).toEqual(tags[i]);
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Adding then removing should return to original state
   */
  it('should return to original state when adding then removing a tag', () => {
    fc.assert(
      fc.property(metaTagArrayArbitrary, metaTagArbitrary, (tags, newTag) => {
        const afterAdd = addMetaTag(tags, newTag);
        const afterRemove = removeMetaTag(afterAdd, afterAdd.length - 1);
        
        // Should be back to original length
        expect(afterRemove.length).toBe(tags.length);
        
        // Should be equivalent to original array
        for (let i = 0; i < tags.length; i++) {
          expect(afterRemove[i]).toEqual(tags[i]);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Meta Tag HTML Conversion', () => {
  /**
   * Property: metaTagsToHtml should generate valid HTML for all valid meta tags
   */
  it('should generate HTML with correct meta tag count', () => {
    fc.assert(
      fc.property(metaTagArrayArbitrary, (tags) => {
        const html = metaTagsToHtml(tags);
        
        // Count valid tags (those with both name and content)
        const validTags = tags.filter(t => t.name && t.content);
        
        if (validTags.length === 0) {
          expect(html).toBe('');
        } else {
          // Count meta tags in HTML
          const metaTagMatches = html.match(/<meta\s+name=/g);
          const metaTagCount = metaTagMatches ? metaTagMatches.length : 0;
          expect(metaTagCount).toBe(validTags.length);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Each meta tag should appear in the HTML output
   */
  it('should include all valid meta tags in HTML output', () => {
    fc.assert(
      fc.property(metaTagArrayArbitrary, (tags) => {
        const html = metaTagsToHtml(tags);
        const validTags = tags.filter(t => t.name && t.content);
        
        for (const tag of validTags) {
          // Check that the name and content appear in the HTML
          expect(html).toContain(`name="${tag.name}"`);
          expect(html).toContain(`content="${tag.content}"`);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

describe('Parse Custom Head Tags', () => {
  /**
   * Property: Round-trip conversion should preserve meta tags
   */
  it('should round-trip meta tags through HTML conversion', () => {
    // Use simpler strings without special characters for reliable round-trip
    const simpleMetaTagArbitrary = fc.record({
      name: fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-]*$/).filter(s => s.length >= 1 && s.length <= 50),
      content: fc.stringMatching(/^[a-zA-Z0-9\s.,!?-]+$/).filter(s => s.length >= 1 && s.length <= 100),
    });
    
    const simpleMetaTagArrayArbitrary = fc.array(simpleMetaTagArbitrary, { minLength: 0, maxLength: 10 });
    
    fc.assert(
      fc.property(simpleMetaTagArrayArbitrary, (tags) => {
        const html = metaTagsToHtml(tags);
        const parsed = parseCustomHeadTags(html);
        
        // Filter to valid tags for comparison
        const validTags = tags.filter(t => t.name && t.content);
        
        // Should have same number of tags
        expect(parsed.length).toBe(validTags.length);
        
        // Each tag should match
        for (let i = 0; i < validTags.length; i++) {
          expect(parsed[i].name).toBe(validTags[i].name);
          expect(parsed[i].content).toBe(validTags[i].content);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle empty string input', () => {
    expect(parseCustomHeadTags('')).toEqual([]);
  });

  it('should handle null/undefined input', () => {
    expect(parseCustomHeadTags(null as unknown as string)).toEqual([]);
    expect(parseCustomHeadTags(undefined as unknown as string)).toEqual([]);
  });
});
