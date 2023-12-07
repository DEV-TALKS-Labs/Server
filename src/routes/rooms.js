import { Router } from "express";
import roomsController from "../controllers/rooms.js";
import userAuth from "../midlewares/userAuth.js";
const router = Router();

router.get("/", roomsController.getRooms);
router.get("/:id", userAuth, roomsController.getRoom);

router.post("/", userAuth, roomsController.postRooms);
router.put("/:id", userAuth, roomsController.putRoom);
router.delete("/:id", userAuth, roomsController.deleteRoom);
router.patch("/:id/join", userAuth, roomsController.joinRoom, roomsController.getRoom);
router.patch("/:id/leave", roomsController.leaveRoom, roomsController.deleteRoom);
export default router;
