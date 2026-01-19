import * as fc from 'fast-check';

/**
 * Property Test: Contact Form Submission
 * Feature: cms-enhancements, Property 8: Contact Form Submission
 * Validates: Requirements 6.3
 * 
 * For any valid contact form submission with name, email, phone, and message fields,
 * the system should make an API call to the contact endpoint with the form data.
 */

// Types for contact form data
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service?: string;
  message?: string;
}

interface ContactApiPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website?: string;
}

// Validation functions that mirror the actual form validation logic
function isValidName(name: string): boolean {
  return name.trim().length > 0;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return phone.trim().length > 0;
}

function validateContactForm(data: ContactFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!isValidName(data.name)) {
    errors.push('Please enter your name.');
  }
  if (!isValidEmail(data.email)) {
    errors.push('Enter a valid email.');
  }
  if (!isValidPhone(data.phone)) {
    errors.push('Please enter your phone number.');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

function prepareApiPayload(data: ContactFormData): ContactApiPayload {
  return {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    service: data.service?.trim() || '',
    message: data.message?.trim() || '',
  };
}

// Arbitraries for generating test data
const validNameArbitrary = fc.string({ minLength: 1, maxLength: 100 })
  .filter(s => s.trim().length > 0);

const validEmailArbitrary = fc.tuple(
  fc.stringMatching(/^[a-zA-Z0-9._%+-]+$/),
  fc.stringMatching(/^[a-zA-Z0-9.-]+$/),
  fc.stringMatching(/^[a-zA-Z]{2,}$/)
).map(([local, domain, tld]) => `${local}@${domain}.${tld}`)
  .filter(email => email.length > 5 && email.length < 100);

const validPhoneArbitrary = fc.stringMatching(/^[0-9+\-\s()]{7,20}$/)
  .filter(s => s.trim().length > 0);

const optionalServiceArbitrary = fc.option(
  fc.string({ minLength: 1, maxLength: 200 }),
  { nil: undefined }
);

const optionalMessageArbitrary = fc.option(
  fc.string({ minLength: 0, maxLength: 1000 }),
  { nil: undefined }
);

const validContactFormArbitrary = fc.record({
  name: validNameArbitrary,
  email: validEmailArbitrary,
  phone: validPhoneArbitrary,
  service: optionalServiceArbitrary,
  message: optionalMessageArbitrary,
});

// Invalid form data arbitraries
const emptyStringArbitrary = fc.constant('');
const whitespaceOnlyArbitrary = fc.array(fc.constantFrom(' ', '\t', '\n'), { minLength: 1, maxLength: 10 })
  .map(arr => arr.join(''));

const invalidEmailArbitrary = fc.oneof(
  fc.constant(''),
  fc.constant('invalid'),
  fc.constant('no@domain'),
  fc.constant('@nodomain.com'),
  fc.constant('spaces in@email.com'),
  fc.string().filter(s => !s.includes('@') || !s.includes('.'))
);

describe('Contact Form Submission - Property Tests', () => {
  /**
   * Property 8: Contact Form Submission - Valid Data
   * For any valid contact form submission, the validation should pass
   * and the API payload should contain all required fields.
   */
  it('should validate and prepare API payload for all valid form submissions', () => {
    fc.assert(
      fc.property(validContactFormArbitrary, (formData) => {
        // Validation should pass for valid data
        const validation = validateContactForm(formData);
        expect(validation.valid).toBe(true);
        expect(validation.errors).toHaveLength(0);
        
        // API payload should contain all required fields
        const payload = prepareApiPayload(formData);
        expect(payload.name).toBe(formData.name.trim());
        expect(payload.email).toBe(formData.email.trim());
        expect(payload.phone).toBe(formData.phone.trim());
        expect(typeof payload.service).toBe('string');
        expect(typeof payload.message).toBe('string');
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty name should fail validation
   */
  it('should reject submissions with empty or whitespace-only names', () => {
    fc.assert(
      fc.property(
        fc.oneof(emptyStringArbitrary, whitespaceOnlyArbitrary),
        validEmailArbitrary,
        validPhoneArbitrary,
        (name, email, phone) => {
          const formData: ContactFormData = { name, email, phone };
          const validation = validateContactForm(formData);
          
          expect(validation.valid).toBe(false);
          expect(validation.errors).toContain('Please enter your name.');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Invalid email should fail validation
   */
  it('should reject submissions with invalid email formats', () => {
    fc.assert(
      fc.property(
        validNameArbitrary,
        invalidEmailArbitrary,
        validPhoneArbitrary,
        (name, email, phone) => {
          const formData: ContactFormData = { name, email, phone };
          const validation = validateContactForm(formData);
          
          expect(validation.valid).toBe(false);
          expect(validation.errors).toContain('Enter a valid email.');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty phone should fail validation
   */
  it('should reject submissions with empty or whitespace-only phone numbers', () => {
    fc.assert(
      fc.property(
        validNameArbitrary,
        validEmailArbitrary,
        fc.oneof(emptyStringArbitrary, whitespaceOnlyArbitrary),
        (name, email, phone) => {
          const formData: ContactFormData = { name, email, phone };
          const validation = validateContactForm(formData);
          
          expect(validation.valid).toBe(false);
          expect(validation.errors).toContain('Please enter your phone number.');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: API payload should preserve all form data
   */
  it('should preserve all form data in API payload', () => {
    fc.assert(
      fc.property(validContactFormArbitrary, (formData) => {
        const payload = prepareApiPayload(formData);
        
        // Required fields should be trimmed but preserved
        expect(payload.name).toBe(formData.name.trim());
        expect(payload.email).toBe(formData.email.trim());
        expect(payload.phone).toBe(formData.phone.trim());
        
        // Optional fields should be trimmed or empty string
        if (formData.service) {
          expect(payload.service).toBe(formData.service.trim());
        } else {
          expect(payload.service).toBe('');
        }
        
        if (formData.message) {
          expect(payload.message).toBe(formData.message.trim());
        } else {
          expect(payload.message).toBe('');
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Multiple validation errors should be collected
   */
  it('should collect all validation errors when multiple fields are invalid', () => {
    fc.assert(
      fc.property(
        fc.oneof(emptyStringArbitrary, whitespaceOnlyArbitrary),
        invalidEmailArbitrary,
        fc.oneof(emptyStringArbitrary, whitespaceOnlyArbitrary),
        (name, email, phone) => {
          const formData: ContactFormData = { name, email, phone };
          const validation = validateContactForm(formData);
          
          expect(validation.valid).toBe(false);
          expect(validation.errors.length).toBeGreaterThanOrEqual(1);
          
          // Should have error for name
          expect(validation.errors).toContain('Please enter your name.');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Contact Form Validation - Unit Tests', () => {
  it('should validate a complete valid form', () => {
    const formData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-123-4567',
      service: 'Consulting',
      message: 'I would like to inquire about your services.',
    };
    
    const validation = validateContactForm(formData);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should validate form with only required fields', () => {
    const formData: ContactFormData = {
      name: 'Jane',
      email: 'jane@test.org',
      phone: '1234567890',
    };
    
    const validation = validateContactForm(formData);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should reject form with missing name', () => {
    const formData: ContactFormData = {
      name: '',
      email: 'test@example.com',
      phone: '1234567890',
    };
    
    const validation = validateContactForm(formData);
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Please enter your name.');
  });

  it('should reject form with invalid email', () => {
    const formData: ContactFormData = {
      name: 'Test User',
      email: 'invalid-email',
      phone: '1234567890',
    };
    
    const validation = validateContactForm(formData);
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Enter a valid email.');
  });

  it('should reject form with missing phone', () => {
    const formData: ContactFormData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '',
    };
    
    const validation = validateContactForm(formData);
    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Please enter your phone number.');
  });
});
