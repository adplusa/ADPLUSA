import { Request, Response } from "express";
import { FAQ } from "../database/schemas/faq.schema";
import { About } from "../database/schemas/about.schema";
import { Contact } from "../database/schemas/contact.schema";
import { ResponseHandler } from "../utils/response";

const getSingleton = async (Model: any, res: Response, notFoundMsg: string) => {
    try {
        const doc = await Model.findOne().lean();
        if (!doc) { ResponseHandler.notFound(res, notFoundMsg); return null; }
        return doc;
    } catch (error) {
        console.error(`Error fetching ${Model.modelName}:`, error);
        ResponseHandler.error(res, "SERVER_ERROR", `Failed to fetch ${Model.modelName}`);
        return null;
    }
};

const updateSingleton = async (Model: any, data: any, res: Response, successMsg: string) => {
    try {
        const doc = await Model.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }).lean();
        ResponseHandler.success(res, doc, successMsg);
    } catch (error: any) {
        if (error.name === "ValidationError") {
            ResponseHandler.validationError(res, ResponseHandler.formatValidationErrors(error));
            return;
        }
        console.error(`Error updating ${Model.modelName}:`, error);
        ResponseHandler.error(res, "SERVER_ERROR", `Failed to update ${Model.modelName}`);
    }
};

export const getFAQ = async (_req: Request, res: Response): Promise<void> => {
    const doc = await getSingleton(FAQ, res, "FAQ not found");
    if (doc) ResponseHandler.success(res, doc);
};

export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
    await updateSingleton(FAQ, req.body, res, "FAQ updated successfully");
};

export const getAbout = async (_req: Request, res: Response): Promise<void> => {
    const doc = await getSingleton(About, res, "About page not found");
    if (doc) ResponseHandler.success(res, doc);
};

export const updateAbout = async (req: Request, res: Response): Promise<void> => {
    await updateSingleton(About, req.body, res, "About page updated successfully");
};

export const getContact = async (_req: Request, res: Response): Promise<void> => {
    const doc = await getSingleton(Contact, res, "Contact page not found");
    if (doc) ResponseHandler.success(res, doc);
};

export const updateContact = async (req: Request, res: Response): Promise<void> => {
    await updateSingleton(Contact, req.body, res, "Contact page updated successfully");
};
