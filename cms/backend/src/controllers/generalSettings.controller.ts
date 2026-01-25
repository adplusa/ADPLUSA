import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { GeneralSettingsSchema } from '../database/schemas/generalSettings.schema';

const GeneralSettingsModel = (mongoose.models.GeneralSettings || mongoose.model('GeneralSettings', GeneralSettingsSchema)) as mongoose.Model<any>;

export const updateGeneralSettings = async (req: Request, res: Response) => {
    try {
        const { siteTitle, siteDescription, contactEmail, footerText } = req.body;

        const settings = await GeneralSettingsModel.findOneAndUpdate(
            {},
            { siteTitle, siteDescription, contactEmail, footerText },
            { upsert: true, new: true }
        );

        return res.status(200).json(settings);
    } catch (error) {
        console.error('Error upserting general settings:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Alias for backward compatibility
export const upsertGeneralSettings = updateGeneralSettings;

export const getGeneralSettings = async (req: Request, res: Response) => {
    try {
        const settings = await GeneralSettingsModel.findOne({});
        if (!settings) {
            return res.status(404).json({ message: 'General settings not found' });
        }
        return res.status(200).json(settings);
    } catch (error) {
        console.error('Error fetching general settings:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};