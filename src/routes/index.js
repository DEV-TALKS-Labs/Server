import { Router } from "express";
import roomsRouter from "./rooms.js";
import filtersRouter from "./filters.js";
const router = Router();
router.use("/rooms", roomsRouter);
router.use("/filters", filtersRouter);

export default router;
