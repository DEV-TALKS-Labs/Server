import { Router } from "express";
import usersController from "../controllers/users.js";
const router = Router();

/**
 * @openapi
 * /api/users:
 *  post:
 *    tags:
 *      - Users
 *    description: Create a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          example:
 *            id: "c7bfdb12-4825-4ea9-9c54-2c05dd7e860f"
 *            name: "TutTrue"
 *            imageUrl: "https://example.com/profile.jpg"
 *    responses:
 *      201:
 *        description: User created successfully
 *        content:
 *          application/json:
 *            example:
 *              user: "User created"
 *      200:
 *        description: User already exists
 *        content:
 *          application/json:
 *            example:
 *              user: "User created"
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            example:
 *              error: "Internal Server Error"
 */
router.post("/", usersController.postUser);

export default router;
