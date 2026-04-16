import { Router } from "express";
import { createListing, deleteListing, getAllListings, getListingById, getListingByOwnerId, updateListing, searchAddress, saveListing, unsaveListing} from "#controllers";
import { verifyToken } from "#middleware";
//import authMiddleware from "#middleware";

const listingRoutes = Router();

//public routes

listingRoutes.get("/", getAllListings);

listingRoutes.get("/search-address", searchAddress);

//protected routes

listingRoutes.post("/", verifyToken, createListing);

listingRoutes.get("/owner/:ownerId", getListingByOwnerId);

//specific routes for saving/unsaving listings

listingRoutes.post("/:id/save", verifyToken, saveListing);

listingRoutes.delete("/:id/save", verifyToken, unsaveListing);

//generic routes for getting/updating/deleting listings by ID

listingRoutes.get("/:_id", getListingById);

listingRoutes.put("/:_id", verifyToken, updateListing);

listingRoutes.delete("/:_id", verifyToken, deleteListing);

export default listingRoutes;