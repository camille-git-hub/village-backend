import { Router } from "express";
import { createListing, deleteListing, getAllListings, getListingById, getListingByOwnerId, updateListing, searchAddress } from "#controllers";
import { verifyToken } from "#middleware";
//import authMiddleware from "#middleware";

const listingRoutes = Router();

listingRoutes.get("/", getAllListings);

listingRoutes.get("/search-address", searchAddress);

listingRoutes.post("/", verifyToken, createListing);

listingRoutes.get("/:_id", getListingById);

listingRoutes.get("/owner/:ownerId", getListingByOwnerId);

listingRoutes.put("/:_id", verifyToken, updateListing);

listingRoutes.delete("/:_id", verifyToken, deleteListing);

export default listingRoutes;