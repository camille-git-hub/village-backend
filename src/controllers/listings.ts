import Listing from "../models/Listing.ts";
import { response, type RequestHandler } from "express";
import { getCoordinatesFromNeighborhood, HAMBURG_NEIGHBORHOODS } from "./../utils/neightborhoods.ts";
import axios from "axios";
import User from "../models/User.ts";


export const searchAddress: RequestHandler = async (req, res, next) => {
    try {
        const { query } = req.query;

        console.log('Received address search query:', query);
        
        if (!query || typeof query !== 'string' || query.length < 3) {
            console.log('Invalid query for address search:', query);
            return res.json([]);
        }

            try {
                console.log("Calling OpenStreetMap API");
                const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: `${query}, Hamburg, Germany`,
                format: 'json',
                countrycodes: 'de',
                limit: 10,
            },
            headers: {
                'User-Agent': 'village-app',

            },
            timeout: 5000,
        });
        console.log('OpenStreetMap API response:', response.data);
        res.json(response.data);
        } catch (axiosError) {
            console.error('Error calling OpenStreetMap API:', axiosError);
            res.status(500).json({ message: 'Error fetching address suggestions' });
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        res.status(500).json({ message: 'Error searching addresses' });
    }
};


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
        const { title, category, description, neighborhood, lat, lng, address } = req.body;

        if (!title || !category || !description || !neighborhood ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (lat === null || lng === null || lng === undefined || lat === undefined) {
            return res.status(400).json({ message: "Latitude and longitude are required. Please select an address from the suggestions." });
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
            address: address || '',
            lat: lat || 0,
            lng: lng || 0,
            ownerId: req.user._id
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

export const getListingByOwnerId: RequestHandler = async (req, res, next) => {
    try {
        const { ownerId } = req.params;
        const listings = await Listing.find({ ownerId }).populate('ownerId', 'email firstName lastName');
        res.status(200).json({ message: "Get listings by owner ID", data: listings });
    } catch (error) {
        next(error);
    }
};

export const updateListing: RequestHandler = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const { title, category, description, neighborhood, address, lat, lng } = req.body;

        const listing = await Listing.findById(_id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.ownerId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (title) listing.title = title;
        if (category) listing.category = category;
        if (description) listing.description = description;
        if (address !== undefined) listing.address = address;

        if (neighborhood) {
            const coords = getCoordinatesFromNeighborhood(neighborhood);
            if (!coords) {
                return res.status(400).json({ message: "Invalid neighborhood: please select a valid neighborhood from this list: " + Object.keys(HAMBURG_NEIGHBORHOODS).join(", ") });
            }
            listing.neighborhood = neighborhood;
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

        if (listing.ownerId.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Listing.findByIdAndDelete(_id);

        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const saveListing: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        // Add to user's savedListings
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedListings: id } },
            { new: true }
        );
        
        // Add user to listing's savedBy
        await Listing.findByIdAndUpdate(
            id,
            { $addToSet: { savedBy: userId } }
        );
        
        res.status(200).json({ message: "Listing saved" });
    } catch (error) {
        next(error);
    }
};

export const unsaveListing: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        await User.findByIdAndUpdate(
            userId,
            { $pull: { savedListings: id } }
        );
        
        await Listing.findByIdAndUpdate(
            id,
            { $pull: { savedBy: userId } }
        );
        
        res.status(200).json({ message: "Listing unsaved" });
    } catch (error) {
        next(error);
    }
};

export const getSavedListings: RequestHandler = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId).populate('savedListings');
        res.status(200).json({ data: user?.savedListings || [] });
    } catch (error) {
        next(error);
    }
};


export default { getAllListings, createListing, getListingById, updateListing, deleteListing, getListingByOwnerId, saveListing, unsaveListing, getSavedListings };