import prisma from "../libs/prisma.js";
import roomsErrorHandler from "./errors/rooms.js";
const getRooms = async (req, res) => {
  /* 
    getRooms function is used to get all rooms from the database.
    It accepts an optional orderBy object in the request body to sort the rooms by a specific field.
    Returns a response with a count of rooms and an array of rooms.
  */

  const orderBy = req.body.orderBy || { createdAt: "desc" };

  try {
    const rooms = await prisma.room.findMany({
      where: {
        isPublic: true,
      },
      orderBy,
      include: {
        filters: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            roomUsers: true,
          },
        },
      },
    });

    const response = {
      count: rooms.length,
      data: rooms,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    roomsErrorHandler(error, res);
  }
};

const joinRoom = async (req, res, next) => {
  /* 
    joinRoom function is used to add a user to a room.
    It accepts a roomId and userId in the request body.
     If the room is public and not full, it adds the user to the room.
     else 
      If the room doesn't exist, it creates a private room.
      If the room is full, it throws an error.
      If the user is already in the room, it throws an error.
      If the room is private and not full, it throws an error.
  */
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
      // Create a private room if it doesn't exist

      req.body.title = "Private Room";
      req.body.maxUsers = 12;
      req.body.isPublic = false;
      req.body.hostId = userId;
      req.body.roodId = id;
      return next();
    } else if (room.roomUsers.length === room.maxUsers) {
      throw "maxUsersError";
    } else if (room.roomUsers.find((user) => user.id === userId)) {
      throw "userAlreadyInRoomError";
    } else {
      const updatedRoom = await prisma.room.update({
        where: {
          id,
        },
        include: {
          roomUsers: true,
          filters: true,
        },
        data: {
          roomUsers: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return res.status(200).send(updatedRoom);
    }
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const postRooms = async (req, res) => {
  /* 
    postRooms function is used to create a room.
    It accepts a title, maxUsers, isPublic, hostId, and filters in the request body.
    connect filters to the room.
    connect the host to the room.
    Returns a response with the created room with response code 201. or throws an error.
  */
  const { title, maxUsers, isPublic, id: hostId, filters } = req.body;

  try {
    if (maxUsers < 2 || maxUsers > 12) {
      throw "usersCountError";
    } else if (!title || !maxUsers || !isPublic || !hostId) {
      throw "missingFieldsError";
    } else {
      const room = await prisma.room.create({
        data: {
          id: req.body.roodId,
          title,
          maxUsers,
          isPublic,
          hostId,
          filters: {
            connect: filters?.map((filterName) => ({
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
    }
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const putRoom = async (req, res) => {
  /* 
    putRoom function is used to update a room.
    It accepts a roomId, hostId, title, maxUsers, isPublic, and filters in the request body.
    Returns a response with the updated room with response code 200. or throws an error.
  */
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
    else if (room.hostId !== hostId) throw "roomHostError";
    else if (maxUsers < room.roomUsers.length) throw "ExistingUsersCountError";
    else {
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
      return res.status(200).json(updatedRoom);
    }
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const deleteRoom = async (req, res) => {
  /* 
    deleteRoom function is used to delete a room.
    It accepts a roomId and hostId in the request body.
    Returns a response with response code 204. or throws an error.
  */

  const { id } = req.params;
  const { id: hostId } = req.body;
  try {
    if (!id) throw "roomIdRequiredError";
    if (!hostId) throw "userIdRequiredError";

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!room || room.hostId !== hostId) throw "roomHostError";
    else {
      await prisma.room.delete({
        where: {
          id,
        },
      });
      return res.status(204).json({});
    }
  } catch (error) {
    roomsErrorHandler(error, res);
  }
};

const leaveRoom = async (req, res, next) => {
  /* 
    leaveRoom function is used to remove a user from a room.
    It accepts a roomId and userId in the request.
    If the user is the host of the room, it assigns a new host.
    If the user is not the host of the room, it removes the user from the room.
    If the user was the only user in the room, it deletes the room.
    Returns a response with response code 200. or throws an error.
  */
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
    else if (room.roomUsers.length === 1 && room.hostId === userId) {
      return next();
    } else if (!room.roomUsers.find((user) => user.id === userId)) {
      throw "userNotInRoomError";
    } else if (room.hostId === userId) {
      // If the user is the host of the room, assign a new host
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
          hostId: room.roomUsers.find((user) => user.id !== userId).id,
        },
      });

      return res.status(200).send({
        message: "You left the room successfully",
      });
    } else {
      // If the user is not the host of the room, remove the user from the room
      const updatedRoom = await prisma.room.update({
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
      return res.status(200).send({
        message: "You left the room successfully",
      });
    }
  } catch (error) {
    console.log(error);
    roomsErrorHandler(error, res);
  }
};
export default {
  getRooms,
  postRooms,
  putRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
};
