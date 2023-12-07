import prisma from "../libs/prisma.js";
import roomsErrorHandler from "./errors/rooms.js";
const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.json(rooms);
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomUsers, filters } = req.body;
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        roomUsers,
        filters,
      },
    });

    if (!room) {
      throw "notFoundError";
    }
    return res.json(room);
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const postRooms = async (req, res) => {
  const { title, maxUsers, isPublic, id: hostId, filters } = req.body;

  try {
    if (maxUsers < 2) throw "usersCountError";
    const room = await prisma.room.create({
      data: {
        title,
        maxUsers,
        isPublic,
        hostId,
        filters: {
          connect: filters.map((filterName) => ({
            name: filterName,
          })),
        },
        roomUsers: {
          connect: {
            id: hostId,
          },
        },
      },
    });
    return res.status(201).json(room);
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const putRoom = async (req, res) => {
  const { id } = req.params;
  const { id: hostId } = req.body;
  const { title, maxUsers, isPublic, filters } = req.body;

  try {
    if (maxUsers > 12 || maxUsers < 2) throw "usersCountError";
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        roomUsers: true,
      },
    });
    if (!room) throw "notFoundError";
    if (room.hostId !== hostId) throw "roomHostError";
    if (maxUsers < room.roomUsers.length) throw "ExistingUsersCountError";

    const updatedRoom = await prisma.room.update({
      where: {
        id,
      },
      data: {
        title,
        maxUsers,
        isPublic,
        filters,
      },
    });
    return res.json(updatedRoom);
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  const { id: hostId } = req.body;

  try {
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!room || room.hostId !== hostId) throw "roomHostError";
    await prisma.room.delete({
      where: {
        id,
      },
    });

    return res.status(204).end();
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const joinRoom = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.body;

  try {
    if (!id) throw "roomIdRequiredError";
    if (!userId) throw "userIdRequiredError";

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        roomUsers: true,
      },
    });

    if (!room) {
      req.body.title = "Private Room";
      req.body.maxUsers = 12;
      req.body.isPublic = false;
      const room = await prisma.room.create({
        data: {
          id,
          title: "Private Room",
          maxUsers: 12,
          isPublic: false,
          hostId: req.body.id,
          roomUsers: {
            connect: {
              id: req.body.id,
            },
          },
        },
      });
      return res.status(201).json(room);
    }

    if (room.roomUsers.length >= room.maxUsers) throw "maxUsersError";

    if (room.roomUsers.find((user) => user.id === userId)) {
      return res.status(409).send({
        error: "You are already in this room",
      });
    }

    await prisma.room.update({
      where: {
        id,
      },
      data: {
        roomUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });

    next();
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const leaveRoom = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.body;

  try {
    if (!id) throw "roomIdRequiredError";
    if (!userId) throw "userIdRequiredError";

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        roomUsers: true,
      },
    });

    if (!room) throw "notFoundError";
    if (room.roomUsers.length === 1 && room.hostId === userId) return next();

    if (!room.roomUsers.find((user) => user.id === userId)) {
      return res.status(409).send({
        error: "You are not in this room",
      });
    }

    const updatableRoom = await prisma.room.update({
      where: {
        id,
      },
      include: {
        roomUsers: true,
      },
      data: {
        roomUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    if (updatableRoom.roomUsers.length === 0) {
      next();
    } else {
      return res.status(200).send({
        message: "You left the room successfully",
      });
    }
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};
export default {
  getRooms,
  postRooms,
  getRoom,
  putRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
};
