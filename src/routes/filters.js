import { Router } from 'express';
import filtersControllers from '../controllers/filters.js';

const router = Router();

/**
 * @openapi
 * /api/filters:
 *  get:
 *    tags:
 *      - Filters
 *    description: Get all filters
 *    responses:
 *        200:
 *          description: Successful response with filters
 *          content:
 *            application/json:
 *              example:
 *                [
 *                  {
 *                    id: "c7bfdb12-4825-4ea9-9c54-2c05dd7e860f",
 *                    name: "Filter 1"
 *                  },
 *                  {
 *                    id: "a3db2fe4-1457-4b8f-a1e9-938de18b8e79",
 *                    name: "Filter 2"
 *                  }
 *                ]
 *        500:
 *          description: Internal Server Error
 *
 */
router.get('/', filtersControllers.getFilters);


/**
 * @openapi
 * /api/filters/{id}/rooms:
 *   get:
 *     tags:
 *       - Filters
 *     description: Get rooms for a specific filter
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The ID of the filter
 *     responses:
 *       200:
 *         description: Successful response with filtered rooms
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   roomId: 1,
 *                   roomName: "Sample Room 1"
 *                 },
 *                 {
 *                   roomId: 2,
 *                   roomName: "Sample Room 2"
 *                 }
 *               ]
 *       404:
 *         description: Filter not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Filter not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
router.get('/:id/rooms', filtersControllers.getFilterRooms);

export default router;
