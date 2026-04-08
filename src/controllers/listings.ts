import Listing from "../models/Listing.ts";
import type { RequestHandler } from "express";
import { getCoordinatesFromNeighborhood, HAMBURG_NEIGHBORHOODS } from "./../utils/neightborhoods.ts";


export const getAllListings: RequestHandler = async (req, res, next) => {
    try {
        const { category, neighborhood, q } = req.query;
        
        const filter: any = {};
        if (category) {
        filter.category = category;
        }
        if (neighborhood) {
        filter.neighborhood = neighborhood;
         }
        if (q) {
        filter.$text = { $search: q };
        }
        
        const listings = await Listing.find(filter)
            .populate('ownerId', 'email firstName lastName')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ message: "Get all listings", data: listings });
    } catch (error) {
    next(error);
     }
};

export const createListing: RequestHandler = async (req, res, next) => {
    try {
        const { title, category, description, neighborhood, city, lat, lng } = req.body;

        if (!title || !category || !description || !neighborhood || !city) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const coords = getCoordinatesFromNeighborhood(neighborhood);
        if (!coords) {
            return res.status(400).json({ message: "Invalid neighborhood: please select a valid neighborhood from this list: " + Object.keys(HAMBURG_NEIGHBORHOODS).join(", ") });
        }

        const newListing = await Listing.create({
            title,
            category,
            description,
            neighborhood,
            city,
            lat: lat || 0,
            lng: lng || 0,
            ownerId: req.user.id
        });

        res.status(201).json({ message: "Listing created successfully", data: newListing });
    } catch (error) {
        next(error);
    }
};

export const getListingById: RequestHandler = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const listing = await Listing.findById(_id).populate('ownerId', 'email firstName lastName');
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).json({ message: "Get listing by ID", data: listing });
    } catch (error) {
        next(error);
    }
};

export const updateListing: RequestHandler = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const { title, category, description, neighborhood, city, lat, lng } = req.body;

        const listing = await Listing.findById(_id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (title) listing.title = title;
        if (category) listing.category = category;
        if (description) listing.description = description;
        if (city) listing.city = city;

        if (neighborhood && neighborhood !== listing.neighborhood) {
            const coords = getCoordinatesFromNeighborhood(neighborhood);
            if (!coords) {
                return res.status(400).json({ message: "Invalid neighborhood: please select a valid neighborhood from this list: " + Object.keys(HAMBURG_NEIGHBORHOODS).join(", ") });
            }
            listing.neighborhood = neighborhood;
            listing.lat = coords.lat;
            listing.lng = coords.lng;
        }

        if (lat !== undefined) listing.lat = lat;
        if (lng !== undefined) listing.lng = lng;

        await listing.save();

        res.status(200).json({ message: "Listing updated successfully", data: listing });
    } catch (error) {
        next(error);
    }
};

export const deleteListing: RequestHandler = async (req, res, next) => {
    try {
        const { _id } = req.params;

        const listing = await Listing.findById(_id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Listing.findByIdAndDelete(_id);

        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export default { getAllListings, createListing, getListingById, updateListing, deleteListing };
