import { Schema } from 'mongoose';

export const GeneralSettingsSchema = new Schema({
    siteTitle: {
        type: String,
        required: true,
    },
    siteDescription: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
    footerText: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default GeneralSettingsSchema;