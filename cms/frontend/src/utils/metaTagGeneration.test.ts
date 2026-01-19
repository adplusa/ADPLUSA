import * as fc from 'fast-check';
import {
    MetaTag,
    generateMetaTagHtml,
    generateMetaTagsHtml,
    parseMetaTagsFromHtml,
    escapeHtml,
    unescapeHtml,
    isValidMetaTag,
    countMetaTagsInHtml,
} from './metaTagGeneration';

/**
 * Property Test: HTML Meta Tag Generation
 * Feature: cms-enhancements, Property 9: HTML Meta Tag Generation
 * Validates: Requirements 2.2, 7.6
 * 
 * For any array of meta tag objects, the generated HTML should contain one meta element
 * per object with matching name and content attributes.
 */

// Arbitrary for generating valid meta tag names (alphanumeric with hyphens)
const metaTagNameArbitrary = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-]*$/)
    .filter(s => s.length >= 1 && s.length <= 50);

// Arbitrary for generating valid meta tag content (alphanumeric with common punctuation)
// Must have at least one non-whitespace character to be valid
const metaTagContentArbitrary = fc.stringMatching(/^[a-zA-Z0-9\s.,!?-]+$/)
    .filter(s => s.length >= 1 && s.length <= 200 && s.trim().length > 0);

// Arbitrary for generating valid meta tags
const validMetaTagArbitrary = fc.record({
    name: metaTagNameArbitrary,
    content: metaTagContentArbitrary,
});

// Arbitrary for generating arrays of valid meta tags
const metaTagArrayArbitrary = fc.array(validMetaTagArbitrary, { minLength: 0, maxLength: 20 });

describe('Property 9: HTML Meta Tag Generation', () => {
    /**
     * Property 9: For any array of meta tag objects, the generated HTML should contain
     * one meta element per object with matching name and content attributes.
     * Validates: Requirements 2.2, 7.6
     */
    describe('Meta Tag Count Property', () => {
        it('should generate exactly one meta element per valid meta tag object', () => {
            fc.assert(
                fc.property(metaTagArrayArbitrary, (tags) => {
                    const html = generateMetaTagsHtml(tags);
                    const validTags = tags.filter(t => t && t.name && t.content);
                    const metaTagCount = countMetaTagsInHtml(html);
                    
                    // The number of meta elements should equal the number of valid tags
                    expect(metaTagCount).toBe(validTags.length);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

    describe('Meta Tag Content Property', () => {
        it('should include matching name and content attributes for each meta tag', () => {
            fc.assert(
                fc.property(metaTagArrayArbitrary, (tags) => {
                    const html = generateMetaTagsHtml(tags);
                    const validTags = tags.filter(t => t && t.name && t.content);
                    
                    for (const tag of validTags) {
                        // Each valid tag's name and content should appear in the HTML
                        expect(html).toContain(`name="${tag.name}"`);
                        expect(html).toContain(`content="${tag.content}"`);
                    }
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

    describe('Round-Trip Property', () => {
        it('should preserve meta tags through HTML generation and parsing', () => {
            fc.assert(
                fc.property(metaTagArrayArbitrary, (tags) => {
                    const html = generateMetaTagsHtml(tags);
                    const parsed = parseMetaTagsFromHtml(html);
                    const validTags = tags.filter(t => t && t.name && t.content);
                    
                    // Should have same number of tags
                    expect(parsed.length).toBe(validTags.length);
                    
                    // Each tag should match (order preserved)
                    for (let i = 0; i < validTags.length; i++) {
                        expect(parsed[i].name).toBe(validTags[i].name);
                        expect(parsed[i].content).toBe(validTags[i].content);
                    }
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

    describe('Empty Array Property', () => {
        it('should return empty string for empty array', () => {
            const html = generateMetaTagsHtml([]);
            expect(html).toBe('');
        });

        it('should return empty string for null/undefined input', () => {
            expect(generateMetaTagsHtml(null as unknown as MetaTag[])).toBe('');
            expect(generateMetaTagsHtml(undefined as unknown as MetaTag[])).toBe('');
        });
    });

    describe('Invalid Tag Filtering Property', () => {
        it('should filter out invalid meta tags (missing name or content)', () => {
            fc.assert(
                fc.property(
                    fc.array(
                        fc.oneof(
                            validMetaTagArbitrary,
                            fc.record({ name: fc.constant(''), content: metaTagContentArbitrary }),
                            fc.record({ name: metaTagNameArbitrary, content: fc.constant('') }),
                            fc.record({ name: fc.constant(''), content: fc.constant('') }),
                        ),
                        { minLength: 0, maxLength: 20 }
                    ),
                    (tags) => {
                        const html = generateMetaTagsHtml(tags);
                        const validTags = tags.filter(t => t && t.name && t.content);
                        const metaTagCount = countMetaTagsInHtml(html);
                        
                        // Only valid tags should be in the output
                        expect(metaTagCount).toBe(validTags.length);
                        
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });
});

describe('HTML Escaping', () => {
    describe('Escape/Unescape Round-Trip', () => {
        it('should preserve strings through escape and unescape', () => {
            fc.assert(
                fc.property(fc.string({ minLength: 0, maxLength: 200 }), (str) => {
                    const escaped = escapeHtml(str);
                    const unescaped = unescapeHtml(escaped);
                    
                    expect(unescaped).toBe(str);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

    describe('XSS Prevention', () => {
        it('should escape HTML special characters', () => {
            const dangerous = '<script>alert("xss")</script>';
            const escaped = escapeHtml(dangerous);
            
            expect(escaped).not.toContain('<');
            expect(escaped).not.toContain('>');
            expect(escaped).toContain('&lt;');
            expect(escaped).toContain('&gt;');
        });

        it('should escape quotes', () => {
            const withQuotes = 'test "quoted" and \'single\'';
            const escaped = escapeHtml(withQuotes);
            
            expect(escaped).not.toContain('"');
            expect(escaped).not.toContain("'");
            expect(escaped).toContain('&quot;');
            expect(escaped).toContain('&#039;');
        });
    });
});

describe('Single Meta Tag Generation', () => {
    it('should generate valid HTML for a single meta tag', () => {
        fc.assert(
            fc.property(validMetaTagArbitrary, (tag) => {
                const html = generateMetaTagHtml(tag);
                
                // Should be a valid meta tag
                expect(html).toMatch(/^<meta name="[^"]+" content="[^"]+" \/>$/);
                expect(html).toContain(`name="${tag.name}"`);
                expect(html).toContain(`content="${tag.content}"`);
                
                return true;
            }),
            { numRuns: 100 }
        );
    });

    it('should return empty string for invalid meta tags', () => {
        expect(generateMetaTagHtml(null as unknown as MetaTag)).toBe('');
        expect(generateMetaTagHtml(undefined as unknown as MetaTag)).toBe('');
        expect(generateMetaTagHtml({ name: '', content: 'test' })).toBe('');
        expect(generateMetaTagHtml({ name: 'test', content: '' })).toBe('');
    });
});

describe('Meta Tag Validation', () => {
    it('should validate correct meta tags', () => {
        fc.assert(
            fc.property(validMetaTagArbitrary, (tag) => {
                expect(isValidMetaTag(tag)).toBe(true);
                return true;
            }),
            { numRuns: 100 }
        );
    });

    it('should reject invalid meta tags', () => {
        expect(isValidMetaTag(null)).toBe(false);
        expect(isValidMetaTag(undefined)).toBe(false);
        expect(isValidMetaTag({})).toBe(false);
        expect(isValidMetaTag({ name: '' })).toBe(false);
        expect(isValidMetaTag({ content: '' })).toBe(false);
        expect(isValidMetaTag({ name: '  ', content: 'test' })).toBe(false);
        expect(isValidMetaTag({ name: 'test', content: '   ' })).toBe(false);
    });
});
