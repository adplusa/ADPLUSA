import { Request, Response } from 'express';
import { Tag } from '../database/schemas/tag.schema';
import { ApiResponse } from '../types/api.types';

// Get all tags
export const getTags = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [tags, total] = await Promise.all([
      Tag.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limitNum),
      Tag.countDocuments(query)
    ]);

    const response: ApiResponse<typeof tags> = {
      success: true,
      data: tags,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch tags' }
    });
  }
};

// Get tag by ID
export const getTagById = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({
        success: false,
        error: { message: 'Tag not found' }
      });
    }

    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch tag' }
    });
  }
};

// Create tag
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, description, color } = req.body;

    // Check if tag with same name exists
    const existingTag = await Tag.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        error: { message: 'Tag with this name already exists' }
      });
    }

    const tag = new Tag({
      name,
      description,
      color: color || '#000000'
    });

    await tag.save();

    res.status(201).json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create tag' }
    });
  }
};

// Update tag
export const updateTag = async (req: Request, res: Response) => {
  try {
    const { name, description, color } = req.body;

    // Check if another tag with same name exists
    if (name) {
      const existingTag = await Tag.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingTag) {
        return res.status(400).json({
          success: false,
          error: { message: 'Tag with this name already exists' }
        });
      }
    }

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name, description, color },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({
        success: false,
        error: { message: 'Tag not found' }
      });
    }

    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update tag' }
    });
  }
};

// Delete tag
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        error: { message: 'Tag not found' }
      });
    }

    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete tag' }
    });
  }
};