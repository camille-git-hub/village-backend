import { Router } from "express";
import { createListing, deleteListing, getAllListings, getListingById, updateListing } from "#controllers";
import { verifyToken } from "#middleware";
//import authMiddleware from "#middleware";

const listingRoutes = Router();

listingRoutes.get("/", getAllListings);

listingRoutes.post("/", verifyToken, createListing);

listingRoutes.get("/:_id", getListingById);

listingRoutes.put("/:_id", verifyToken, updateListing);

listingRoutes.delete("/:_id", verifyToken, deleteListing);
export default listingRoutes;