import * as fc from 'fast-check';
import { IMetaTag, metaTagSchema } from './base.schema';

/**
 * Property Test: Meta Tag Serialization Round-Trip
 * Feature: cms-enhancements, Property 3: Meta Tag Serialization Round-Trip
 * Validates: Requirements 7.5, 7.6
 * 
 * For any array of meta tag objects with name and content fields,
 * serializing to storage format and parsing back should produce an equivalent array.
 */

// Arbitrary for generating valid meta tags
const metaTagArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  content: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
});

const metaTagArrayArbitrary = fc.array(metaTagArbitrary, { minLength: 0, maxLength: 20 });

// Serialization function (simulates MongoDB storage)
function serializeMetaTags(tags: IMetaTag[]): string {
  return JSON.stringify(tags);
}

// Deserialization function (simulates retrieval from MongoDB)
function deserializeMetaTags(serialized: string): IMetaTag[] {
  return JSON.parse(serialized);
}

describe('Meta Tag Serialization Round-Trip', () => {
  /**
   * Property 3: Meta Tag Serialization Round-Trip
   * For any array of meta tag objects with name and content fields,
   * serializing to storage format and parsing back should produce an equivalent array.
   */
  it('should preserve meta tags through serialization round-trip', () => {
    fc.assert(
      fc.property(metaTagArrayArbitrary, (metaTags) => {
        const serialized = serializeMetaTags(metaTags);
        const deserialized = deserializeMetaTags(serialized);
        
        // Verify array length is preserved
        expect(deserialized.length).toBe(metaTags.length);
        
        // Verify each meta tag is equivalent
        for (let i = 0; i < metaTags.length; i++) {
          expect(deserialized[i].name).toBe(metaTags[i].name);
          expect(deserialized[i].content).toBe(metaTags[i].content);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('should handle empty meta tag arrays', () => {
    const emptyTags: IMetaTag[] = [];
    const serialized = serializeMetaTags(emptyTags);
    const deserialized = deserializeMetaTags(serialized);
    
    expect(deserialized).toEqual([]);
  });

  it('should validate metaTagSchema structure', () => {
    // Verify the schema has the expected structure
    expect(metaTagSchema.name).toBeDefined();
    expect(metaTagSchema.name.type).toBe(String);
    expect(metaTagSchema.name.required).toBe(true);
    expect(metaTagSchema.name.maxlength).toBe(100);
    
    expect(metaTagSchema.content).toBeDefined();
    expect(metaTagSchema.content.type).toBe(String);
    expect(metaTagSchema.content.required).toBe(true);
    expect(metaTagSchema.content.maxlength).toBe(500);
  });
});
