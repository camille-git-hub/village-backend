import { Schema, model } from 'mongoose';

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true
        },
        neighborhood: {
            type: String,
            required: [true, 'Neighborhood is required'],
            trim: true
        },
        lat: {
            type: Number,
            default: null
        },
        lng: {
            type: Number,
            default: null
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner ID is required']
        },
        address: {
            type: String,
            default: ''
        },
    },
    {
        timestamps: true
        }
);

listingSchema.index({ title: 'text', description: 'text', category: 'text' });

export default model('Listing', listingSchema);