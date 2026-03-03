import { Request, Response } from "express";
import { Project } from "../database/schemas/project.schema";
import { deleteMultipleImagesFromS3 } from "../utils/s3";
import { ResponseHandler } from "../utils/response";
import { PaginationHelper } from "../utils/pagination";
import { S3Utils } from "../utils/s3-helpers";

export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, category, featured, search, sort = "-createdAt" } = req.query;
      const { pageNum, limitNum, skip } = PaginationHelper.parse(page, limit);

      const filter: any = {};
      if (category) filter.category = category;
      if (featured !== undefined) filter.featured = featured === "true";
      if (search) {
          filter.$or = [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
          ];
      }

      const [projects, total] = await Promise.all([
        Project.find(filter).sort(sort as string).skip(skip).limit(limitNum).lean(),
        Project.countDocuments(filter),
    ]);

      const response = PaginationHelper.buildResponse(projects, total, pageNum, limitNum);
      ResponseHandler.success(res, response.data, undefined, 200);
  } catch (error) {
      console.error("Error fetching projects:", error);
      ResponseHandler.error(res, "SERVER_ERROR", "Failed to fetch projects");
  }
};

export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = await Project.findOne({ slug: req.params.slug }).lean();
      if (!project) { ResponseHandler.notFound(res, "Project not found"); return; }
      ResponseHandler.success(res, project);
  } catch (error) {
      console.error("Error fetching project:", error);
      ResponseHandler.error(res, "SERVER_ERROR", "Failed to fetch project");
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, slug, description, images, category, featured, link, seoTitle, seoDescription, moreContent, projectDetails, introText } = req.body;

      if (!title || !slug) {
        ResponseHandler.validationError(res, { title: !title ? "Required" : "", slug: !slug ? "Required" : "" });
        return;
    }

      if (await Project.findOne({ slug })) {
          ResponseHandler.error(res, "DUPLICATE_SLUG", `Project with slug "${slug}" already exists`, 400);
          return;
      }

      const project = new Project({ title, slug, description, introText, images: images || [], moreContent, projectDetails: projectDetails || [], category, featured: featured || false, link, seoTitle, seoDescription });
      await project.save();
      ResponseHandler.success(res, project, "Project created successfully", 201);
  } catch (error: any) {
      if (error.name === "ValidationError") {
        ResponseHandler.validationError(res, ResponseHandler.formatValidationErrors(error));
        return;
    }
      console.error("Error creating project:", error);
      ResponseHandler.error(res, "SERVER_ERROR", "Failed to create project");
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) { ResponseHandler.notFound(res, "Project not found"); return; }

      const { title, slug, description, images, category, featured, link, seoTitle, seoDescription, moreContent, projectDetails, introText } = req.body;

      if (slug && slug !== project.slug && await Project.findOne({ slug, _id: { $ne: req.params.id } })) {
          ResponseHandler.error(res, "DUPLICATE_SLUG", `Project with slug "${slug}" already exists`, 400);
          return;
      }

      const originalSlug = project.slug;
      Object.assign(project, { title, slug, description, introText, images, moreContent, projectDetails, category, featured, link, seoTitle, seoDescription });
      await project.save();

      ResponseHandler.success(res, project, "Project updated successfully");
  } catch (error: any) {
      if (error.name === "ValidationError") {
        ResponseHandler.validationError(res, ResponseHandler.formatValidationErrors(error));
        return;
    }
      console.error("Error updating project:", error);
      ResponseHandler.error(res, "SERVER_ERROR", "Failed to update project");
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) { ResponseHandler.notFound(res, "Project not found"); return; }

      const imageKeys = project.images?.map((img) => S3Utils.extractKeyFromUrl(img.url)).filter(Boolean) || [];
      await Project.findByIdAndDelete(req.params.id);

      if (imageKeys.length > 0) {
        try { await deleteMultipleImagesFromS3(imageKeys as string[]); } catch (err) { console.error("S3 deletion error:", err); }
    }

      ResponseHandler.success(res, { deletedProject: project._id, deletedImages: imageKeys.length }, "Project deleted successfully");
  } catch (error) {
      console.error("Error deleting project:", error);
      ResponseHandler.error(res, "SERVER_ERROR", "Failed to delete project");
  }
};
