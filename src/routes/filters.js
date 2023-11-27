import { Router } from "express";
import filtersControllers from "../controllers/filters.js";

const router = Router();

router.get("/", filtersControllers.getFilters);
router.get("/:id/rooms", filtersControllers.getFilterRooms);

export default router;
