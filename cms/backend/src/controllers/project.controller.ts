import { Request, Response } from 'express';
import { Project } from '../database/schemas/project.schema';
import { deleteImageFromS3, deleteMultipleImagesFromS3 } from '../utils/s3';

/**
 * @route   GET /api/projects
 * @desc    Get all projects with pagination and filtering
 * @access  Public
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      category,
      featured,
      search,
      sort = '-createdAt',
    } = req.query;

    // Parse pagination parameters
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Project.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch projects',
      },
    });
  }
};

/**
 * @route   GET /api/projects/:slug
 * @desc    Get single project by slug
 * @access  Public
 */
export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug }).lean();

    if (!project) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Project with slug "${slug}" not found`,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch project',
      },
    });
  }
};

/**
 * @route   POST /api/admin/projects
 * @desc    Create new project
 * @access  Protected (Admin)
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, description, images, category, featured, link, seoTitle, seoDescription } = req.body;

    // Validate required fields
    if (!title || !slug) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title and slug are required',
          details: {
            title: !title ? 'Title is required' : undefined,
            slug: !slug ? 'Slug is required' : undefined,
          },
        },
      });
      return;
    }

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: `Project with slug "${slug}" already exists`,
        },
      });
      return;
    }

    // Create new project
    const project = new Project({
      title,
      slug,
      description,
      images: images || [],
      category,
      featured: featured || false,
      link,
      seoTitle,
      seoDescription,
    });

    await project.save();

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully',
    });
  } catch (error: any) {
    console.error('Error creating project:', error);

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
        message: 'Failed to create project',
      },
    });
  }
};

/**
 * @route   PUT /api/admin/projects/:id
 * @desc    Update project
 * @access  Protected (Admin)
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, slug, description, images, category, featured, link, seoTitle, seoDescription } = req.body;

    // Find project
    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Project with ID "${id}" not found`,
        },
      });
      return;
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== project.slug) {
      const existingProject = await Project.findOne({ slug, _id: { $ne: id } });
      if (existingProject) {
        res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_SLUG',
            message: `Project with slug "${slug}" already exists`,
          },
        });
        return;
      }
    }

    // Update fields
    if (title !== undefined) project.title = title;
    if (slug !== undefined) project.slug = slug;
    if (description !== undefined) project.description = description;
    if (images !== undefined) project.images = images;
    if (category !== undefined) project.category = category;
    if (featured !== undefined) project.featured = featured;
    if (link !== undefined) project.link = link;
    if (seoTitle !== undefined) project.seoTitle = seoTitle;
    if (seoDescription !== undefined) project.seoDescription = seoDescription;

    await project.save();

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating project:', error);

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
        message: 'Failed to update project',
      },
    });
  }
};

/**
 * @route   DELETE /api/admin/projects/:id
 * @desc    Delete project and associated images
 * @access  Protected (Admin)
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find project
    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Project with ID "${id}" not found`,
        },
      });
      return;
    }

    // Extract image keys from URLs for deletion
    const imageKeys: string[] = [];
    if (project.images && project.images.length > 0) {
      project.images.forEach((image) => {
        if (image.url) {
          // Extract key from S3 URL
          // URL format: https://bucket-name.s3.region.amazonaws.com/folder/filename.jpg
          const urlParts = image.url.split('.amazonaws.com/');
          if (urlParts.length > 1) {
            imageKeys.push(urlParts[1]);
          }
        }
      });
    }

    // Delete project from database
    await Project.findByIdAndDelete(id);

    // Delete associated images from S3
    if (imageKeys.length > 0) {
      try {
        await deleteMultipleImagesFromS3(imageKeys);
      } catch (s3Error) {
        console.error('Error deleting images from S3:', s3Error);
        // Continue even if S3 deletion fails - project is already deleted
      }
    }

    res.status(200).json({
      success: true,
      message: 'Project and associated images deleted successfully',
      data: {
        deletedProject: project._id,
        deletedImages: imageKeys.length,
      },
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete project',
      },
    });
  }
};
