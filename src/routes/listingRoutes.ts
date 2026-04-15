import { Router } from "express";
import { createListing, deleteListing, getAllListings, getListingById, getListingByOwnerId, updateListing, searchAddress, saveListing, unsaveListing, getSavedListings } from "#controllers";
import { verifyToken } from "#middleware";
//import authMiddleware from "#middleware";

const listingRoutes = Router();

listingRoutes.get("/", getAllListings);

listingRoutes.get("/search-address", searchAddress);

listingRoutes.post("/", verifyToken, createListing);

listingRoutes.get("/owner/:ownerId", getListingByOwnerId);

listingRoutes.put("/:_id", verifyToken, updateListing);

listingRoutes.delete("/:_id", verifyToken, deleteListing);

listingRoutes.post('/:id/save', verifyToken, saveListing);

listingRoutes.delete('/:id/save', verifyToken, unsaveListing);

listingRoutes.get('/user/:userId/saved', verifyToken, getSavedListings);

listingRoutes.get("/:_id", getListingById);

export default listingRoutes;