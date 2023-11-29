import { Router } from "express";
import roomsRouter from "./rooms.js";
import filtersRouter from "./filters.js";
import usersRouter from "./users.js";
const router = Router();
router.use("/rooms", roomsRouter);
router.use("/filters", filtersRouter);
router.use("/users", usersRouter);
export default router;
