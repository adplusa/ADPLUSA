import { Request, Response } from 'express';
import { FAQ } from '../database/schemas/faq.schema';
import { About } from '../database/schemas/about.schema';
import { Contact } from '../database/schemas/contact.schema';

/**
 * @route   GET /api/faq
 * @desc    Get FAQ data
 * @access  Public
 */
export const getFAQ = async (_req: Request, res: Response): Promise<void> => {
  try {
    // FAQ is a singleton document, so we get the first one
    const faq = await FAQ.findOne().lean();

    if (!faq) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'FAQ data not found',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch FAQ data',
      },
    });
  }
};

/**
 * @route   GET /api/about
 * @desc    Get About page data
 * @access  Public
 */
export const getAbout = async (_req: Request, res: Response): Promise<void> => {
  try {
    // About is a singleton document, so we get the first one
    const about = await About.findOne().lean();

    if (!about) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'About page data not found',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error('Error fetching About page:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch About page data',
      },
    });
  }
};

/**
 * @route   GET /api/contact
 * @desc    Get Contact page data
 * @access  Public
 */
export const getContact = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Contact is a singleton document, so we get the first one
    const contact = await Contact.findOne().lean();

    if (!contact) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Contact page data not found',
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching Contact page:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch Contact page data',
      },
    });
  }
};

/**
 * @route   PUT /api/admin/faq
 * @desc    Update FAQ data (singleton document)
 * @access  Protected (Admin)
 */
export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, categories, seoTitle, seoDescription } = req.body;

    // Find existing FAQ document or create new one
    let faq = await FAQ.findOne();

    if (!faq) {
      // Create new FAQ document if none exists
      faq = new FAQ({
        title: title || 'Frequently Asked Questions',
        categories: categories || [],
        seoTitle,
        seoDescription,
      });
    } else {
      // Update existing FAQ document
      if (title !== undefined) faq.title = title;
      if (categories !== undefined) faq.categories = categories;
      if (seoTitle !== undefined) faq.seoTitle = seoTitle;
      if (seoDescription !== undefined) faq.seoDescription = seoDescription;
    }

    await faq.save();

    res.status(200).json({
      success: true,
      data: faq,
      message: 'FAQ updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating FAQ:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: any = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors,
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update FAQ',
      },
    });
  }
};

/**
 * @route   PUT /api/admin/about
 * @desc    Update About page data (singleton document)
 * @access  Protected (Admin)
 */
export const updateAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      allowLightHeading,
      allowUsHeading,
      allowRightHeading,
      paragraph,
      anchorLinks,
      sections,
      seoTitle,
      seoDescription,
    } = req.body;

    // Find existing About document or create new one
    let about = await About.findOne();

    if (!about) {
      // Create new About document if none exists
      about = new About({
        allowLightHeading,
        allowUsHeading,
        allowRightHeading,
        paragraph,
        anchorLinks: anchorLinks || [],
        sections: sections || [],
        seoTitle,
        seoDescription,
      });
    } else {
      // Update existing About document
      if (allowLightHeading !== undefined) about.allowLightHeading = allowLightHeading;
      if (allowUsHeading !== undefined) about.allowUsHeading = allowUsHeading;
      if (allowRightHeading !== undefined) about.allowRightHeading = allowRightHeading;
      if (paragraph !== undefined) about.paragraph = paragraph;
      if (anchorLinks !== undefined) about.anchorLinks = anchorLinks;
      if (sections !== undefined) about.sections = sections;
      if (seoTitle !== undefined) about.seoTitle = seoTitle;
      if (seoDescription !== undefined) about.seoDescription = seoDescription;
    }

    await about.save();

    res.status(200).json({
      success: true,
      data: about,
      message: 'About page updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating About page:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: any = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors,
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update About page',
      },
    });
  }
};

/**
 * @route   PUT /api/admin/contact
 * @desc    Update Contact page data (singleton document)
 * @access  Protected (Admin)
 */
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, contactInfo, seoTitle, seoDescription } = req.body;

    // Find existing Contact document or create new one
    let contact = await Contact.findOne();

    if (!contact) {
      // Create new Contact document if none exists
      contact = new Contact({
        title: title || 'Contact Us',
        description,
        contactInfo: contactInfo || {},
        seoTitle,
        seoDescription,
      });
    } else {
      // Update existing Contact document
      if (title !== undefined) contact.title = title;
      if (description !== undefined) contact.description = description;
      if (contactInfo !== undefined) contact.contactInfo = contactInfo;
      if (seoTitle !== undefined) contact.seoTitle = seoTitle;
      if (seoDescription !== undefined) contact.seoDescription = seoDescription;
    }

    await contact.save();

    res.status(200).json({
      success: true,
      data: contact,
      message: 'Contact page updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating Contact page:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors: any = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });

      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors,
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update Contact page',
      },
    });
  }
};
