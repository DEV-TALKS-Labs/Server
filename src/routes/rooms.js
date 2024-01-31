import { Router } from 'express';
import roomsController from '../controllers/rooms.js';
import userAuth from '../midlewares/userAuth.js';
const router = Router();

/**
 * @openapi
 * /api/rooms:
 *  get:
 *    tags:
 *      - Rooms
 *    description: Get all public rooms
 *    responses:
 *      200:
 *        description: Successful response with public rooms
 *        content:
 *          application/json:
 *            example:
 *              count: 2
 *              data:
 *                - id: "c7bfdb12-4825-4ea9-9c54-2c05dd7e860f"
 *                  title: "Sample Room 1"
 *                  maxUsers: 5
 *                  isPublic: true
 *                  hostId: "host_user_id"
 *                  createdAt: "2024-01-01T12:00:00.000Z"
 *                  coHostId: null,
 *                  filters: []
 *                  _count:
 *                     roomUsers: 4
 *
 *                - id: "a3db2fe4-1457-4b8f-a1e9-938de18b8e79"
 *                  title: "Sample Room 2"
 *                  maxUsers: 10
 *                  isPublic: true
 *                  hostId: "host_user_id"
 *                  filters: []
 *                  createdAt: "2024-01-01T12:00:00.000Z"
 *                  coHostId: null,
 *                  _count:
 *                    roomUsers: 2
 * 
 *      500:
 *        description: Internal Server Error
 */
router.get('/', roomsController.getRooms);

/**
 * @openapi
 * /api/rooms/{id}:
 *   get:
 *     tags:
 *       - Rooms
 *     description: Get details of a specific room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room
 *     responses:
 *       200:
 *         description: Successful response with room details
 *         content:
 *           application/json:
 *             example:
 *               id: "c7bfdb12-4825-4ea9-9c54-2c05dd7e860f"
 *               title: "Sample Room"
 *               maxUsers: 5
 *               isPublic: true
 *               hostId: "host_user_id"
 *               filters: []
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Room not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.get('/:id', roomsController.getRoom);

/**
 * @openapi
 * /api/rooms:
 *   post:
 *     tags:
 *       - Rooms
 *     description: Create a new room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "New Room"
 *             maxUsers: 8
 *             isPublic: true
 *             hostId: "host_user_id"
 *             filters: []
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "new_room_id"
 *               title: "New Room"
 *               maxUsers: 8
 *               isPublic: true
 *               hostId: "host_user_id"
 *               filters: []
 *       403:
 *         description: Max users count reached or invalid user input
 *         content:
 *           application/json:
 *             example:
 *               error: "Max users count reached, you cannot join this room"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.post('/', userAuth, roomsController.postRooms);

/**
 * @openapi
 * /api/rooms/{id}:
 *   put:
 *     tags:
 *       - Rooms
 *     description: Update details of a specific room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Updated Room"
 *             maxUsers: 10
 *             isPublic: false
 *             filters: []
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "c7bfdb12-4825-4ea9-9c54-2c05dd7e860f"
 *               title: "Updated Room"
 *               maxUsers: 10
 *               isPublic: false
 *               hostId: "host_user_id"
 *               filters: []
 *       403:
 *         description: Max users count reached or invalid user input
 *         content:
 *           application/json:
 *             example:
 *               error: "Max users count reached, you cannot join this room"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Room not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.put('/:id', userAuth, roomsController.putRoom);

/**
 * @openapi
 * /api/rooms/{id}:
 *   delete:
 *     tags:
 *       - Rooms
 *     description: Delete a specific room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room
 *     responses:
 *       204:
 *         description: Room deleted successfully
 *       403:
 *         description: Invalid user input or user not authorized to delete the room
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid user input"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Room not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.delete('/:id', userAuth, roomsController.deleteRoom);

/**
 * @openapi
 * /api/rooms/{id}/join:
 *   patch:
 *     tags:
 *       - Rooms
 *     description: Join a specific room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: "user_id"
 *     responses:
 *       200:
 *         description: User joined the room successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "You joined the room successfully"
 *       403:
 *         description: Max users count reached or invalid user input
 *         content:
 *           application/json:
 *             example:
 *               error: "Max users count reached, you cannot join this room"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Room not found"
 *       409:
 *         description: User already in the room
 *         content:
 *           application/json:
 *             example:
 *               error: "User already in the room"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.patch(
  '/:id/join',
  userAuth,
  roomsController.joinRoom,
  roomsController.postRooms
);

/**
 * @openapi
 * /api/rooms/{id}/leave:
 *   patch:
 *     tags:
 *       - Rooms
 *     description: Leave a specific room
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             id: "user_id"
 *     responses:
 *       200:
 *         description: User left the room successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "You left the room successfully"
 *       403:
 *         description: Invalid user input or user not authorized to leave the room
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid user input"
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Room not found"
 *       409:
 *         description: User not in the room
 *         content:
 *           application/json:
 *             example:
 *               error: "You are not in the room"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.patch(
  '/:id/leave',
  roomsController.leaveRoom,
  roomsController.deleteRoom
);
export default router;
