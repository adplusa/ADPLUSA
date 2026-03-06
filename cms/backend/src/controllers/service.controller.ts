import { Request, Response } from "express";
import { Service } from "../database/schemas/service.schema";
import { deleteMultipleImagesFromS3 } from "../utils/s3";
import { ResponseHandler } from "../utils/response";
import { S3Utils } from "../utils/s3-helpers";


export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, sort = "-createdAt", page, limit } = req.query;
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [services, total] = await Promise.all([
      Service.find(filter).sort(sort as string).skip(skip).limit(limitNum).lean(),
      Service.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        data: services,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    ResponseHandler.error(res, "SERVER_ERROR", "Failed to fetch services");
  }
};

export const getServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findOne({ slug: req.params.slug }).lean();
    if (!service) { ResponseHandler.notFound(res, "Service not found"); return; }
    ResponseHandler.success(res, service);
  } catch (error) {
    console.error("Error fetching service:", error);
    ResponseHandler.error(res, "SERVER_ERROR", "Failed to fetch service");
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, slug, description, content, bannerImage, features, image, seoTitle, seoDescription, servicesList, keyActivities, order, customHeadTags } = req.body;

    if (!title || !slug) {
      ResponseHandler.validationError(res, { title: !title ? "Required" : "", slug: !slug ? "Required" : "" });
      return;
    }

    if (await Service.findOne({ slug })) {
      ResponseHandler.error(res, "DUPLICATE_SLUG", `Service with slug "${slug}" already exists`, 400);
      return;
    }

    const service = new Service({ title, slug, description, content, bannerImage, servicesList: servicesList || [], keyActivities: keyActivities || [], features: features || [], image, order, seoTitle, seoDescription, customHeadTags });
    await service.save();

    ResponseHandler.success(res, service, "Service created successfully", 201);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      ResponseHandler.validationError(res, ResponseHandler.formatValidationErrors(error));
      return;
    }
    console.error("Error creating service:", error);
    ResponseHandler.error(res, "SERVER_ERROR", "Failed to create service");
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) { ResponseHandler.notFound(res, "Service not found"); return; }

    const { title, slug, description, content, bannerImage, features, image, seoTitle, seoDescription, servicesList, keyActivities, order, customHeadTags } = req.body;

    if (slug && slug !== service.slug && await Service.findOne({ slug, _id: { $ne: req.params.id } })) {
      ResponseHandler.error(res, "DUPLICATE_SLUG", `Service with slug "${slug}" already exists`, 400);
      return;
    }

    const originalSlug = service.slug;
    Object.assign(service, { title, slug, description, content, bannerImage, servicesList, keyActivities, features, image, order, seoTitle, seoDescription, customHeadTags });
    await service.save();



    ResponseHandler.success(res, service, "Service updated successfully");
  } catch (error: any) {
    if (error.name === "ValidationError") {
      ResponseHandler.validationError(res, ResponseHandler.formatValidationErrors(error));
      return;
    }
    console.error("Error updating service:", error);
    ResponseHandler.error(res, "SERVER_ERROR", "Failed to update service");
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) { ResponseHandler.notFound(res, "Service not found"); return; }

    const imageKeys = [
      S3Utils.extractKeyFromUrl(service.bannerImage?.url),
      S3Utils.extractKeyFromUrl(service.image?.url),
    ].filter(Boolean);

    await Service.findByIdAndDelete(req.params.id);

    if (imageKeys.length > 0) {
      try { await deleteMultipleImagesFromS3(imageKeys as string[]); } catch (err) { console.error("S3 deletion error:", err); }
    }


    ResponseHandler.success(res, { deletedService: service._id, deletedImages: imageKeys.length }, "Service deleted successfully");
  } catch (error) {
    console.error("Error deleting service:", error);
    ResponseHandler.error(res, "SERVER_ERROR", "Failed to delete service");
  }
};
