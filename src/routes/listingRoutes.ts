import { Router } from "express";
import { createListing, deleteListing, getAllListings, getListingById, getListingByOwnerId, updateListing, searchAddress, saveListing, unsaveListing} from "#controllers";
import { verifyToken } from "#middleware";
//import authMiddleware from "#middleware";

const listingRoutes = Router();

listingRoutes.get("/", getAllListings);

listingRoutes.get("/search-address", searchAddress);

listingRoutes.post("/", verifyToken, createListing);

listingRoutes.post("/:id/save", verifyToken, saveListing);

listingRoutes.delete("/:id/save", verifyToken, unsaveListing);

listingRoutes.get("/owner/:ownerId", getListingByOwnerId);

listingRoutes.get("/:_id", getListingById);

listingRoutes.put("/:_id", verifyToken, updateListing);

listingRoutes.delete("/:_id", verifyToken, deleteListing);

export default listingRoutes;