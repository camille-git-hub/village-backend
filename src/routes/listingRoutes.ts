import { Router } from "express";
import { createListing, deleteListing, getAllListings, getListingById, updateListing } from "#controllers";
import { verifyToken } from "#middleware";
//import authMiddleware from "#middleware";

const listingRoutes = Router();

listingRoutes.get("/", getAllListings);

listingRoutes.post("/", verifyToken, createListing);

listingRoutes.get("/:id", getListingById);

listingRoutes.put("/:id", verifyToken, updateListing);

listingRoutes.delete("/:id", verifyToken, deleteListing);

export default listingRoutes;