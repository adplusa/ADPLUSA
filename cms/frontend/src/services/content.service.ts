import api from './axios';

// FAQ Types
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  description?: string;
  chatLink?: string;
  image?: {
    url: string;
    darkModeUrl?: string;
  };
  faqs: FAQItem[];
}

export interface FAQ {
  _id?: string;
  title?: string;
  categories: FAQCategory[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

// About Types
export interface AnchorLink {
  label: string;
  targetId: string;
}

export interface AboutSection {
  sectionId: string;
  title: string;
  body: string;
  image?: {
    url: string;
    darkModeUrl?: string;
  };
}

export interface About {
  _id?: string;
  allowLightHeading?: string;
  allowUsHeading?: string;
  allowRightHeading?: string;
  paragraph?: string;
  anchorLinks?: AnchorLink[];
  sections?: AboutSection[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Contact Types
export interface Contact {
  _id?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContentResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Get FAQ data
 */
export const getFAQ = async (): Promise<ContentResponse<FAQ>> => {
  const response = await api.get<ContentResponse<FAQ>>('/faq');
  return response.data;
};

/**
 * Update FAQ data (admin only)
 */
export const updateFAQ = async (faq: FAQ): Promise<ContentResponse<FAQ>> => {
  const response = await api.put<ContentResponse<FAQ>>('/admin/faq', faq);
  return response.data;
};

/**
 * Get About page data
 */
export const getAbout = async (): Promise<ContentResponse<About>> => {
  const response = await api.get<ContentResponse<About>>('/about');
  return response.data;
};

/**
 * Update About page data (admin only)
 */
export const updateAbout = async (about: About): Promise<ContentResponse<About>> => {
  const response = await api.put<ContentResponse<About>>('/admin/about', about);
  return response.data;
};

/**
 * Get Contact page data
 */
export const getContact = async (): Promise<ContentResponse<Contact>> => {
  const response = await api.get<ContentResponse<Contact>>('/contact');
  return response.data;
};

/**
 * Update Contact page data (admin only)
 */
export const updateContact = async (contact: Contact): Promise<ContentResponse<Contact>> => {
  const response = await api.put<ContentResponse<Contact>>('/admin/contact', contact);
  return response.data;
};
