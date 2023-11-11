import { Router } from "express";
import roomsController from "../controllers/rooms.js";
const router = Router();

router.get("/", roomsController.getRooms);
router.post("/");

router.get("/:id");
router.put("/:id");
router.delete("/:id");

export default router;
