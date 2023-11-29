import prisma from "../libs/prisma.js";

const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const getRoom = async (req, res) => {
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
      return res.status(404).send({
        error: "Room not found",
      });
    }
    return res.json(room);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const postRooms = async (req, res) => {
  const { title, maxUsers, isPublic, id: hostId, filters } = req.body;

  try {
    if (maxUsers < 2) throw "maxUsers must be greater than 1";
    const room = await prisma.room.create({
      data: {
        title,
        maxUsers,
        isPublic,
        hostId,
        filters:{
          connect: filters.map(filterName => ({
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
    if (error.code === "P2002") {
      console.error("User Cann't host more than one room", hostId);
      return res.status(409).send({
        error: "User Cann't host more than one room",
      });
    } else if (error.code === "P2003") {
      console.error("invalid User", hostId);
      return res.status(404).send({
        error: "invalid User",
      });
    } else if (error === "maxUsers must be greater than 1")
      return res.status(409).send({
        error: "maxUsers must be greater than 1",
      });

    console.error("Error creating room:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const putRoom = async (req, res) => {
  const { id } = req.params;
  const { id: hostId } = req.body;
  const { title, maxUsers, isPublic, filters } = req.body;
  try {
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (room.hostId !== hostId) {
      return res.status(404).send({
        error: "Room not found or you are not the host",
      });
    }

    if (maxUsers < room.roomUsers.length) {
      return res.status(409).send({
        error: "maxUsers must be greater than current users",
      });
    }

    await prisma.room.update({
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

    if (!room) {
      return res.status(404).send({
        error: "Room not found or you are not the host",
      });
    }
    return res.json(room);
  } catch (error) {
    if (error.code === "P2025") {
      console.error("Room not found or you are not the host", id);
      return res.status(404).send({
        error: "Room not found or you are not the host",
      });
    }
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteRoom = async (req, res) => {
  const { id } = req.params;
  const { id: hostId } = req.body;

  console.log(id, hostId);
  try {
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) {
      return res.status(404).send({
        error: "Room not found",
      });
    }

    if (room.hostId !== hostId) {
      return res.status(404).send({
        error: "you are not the host",
      });
    }

    await prisma.room.delete({
      where: {
        id,
      },
    });

    return res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const joinRoom = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.body;

  try {
    if (!id || !userId) {
      return res.status(400).send({
        error: "id and userId are required",
      });
    }
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        roomUsers: true,
      },
    });

    if (!room) {
      return res.status(404).send({
        error: "Room not found",
      });
    }

    if (room.roomUsers.length >= room.maxUsers) {
      return res.status(409).send({
        error: "Room is full",
      });
    }

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

    return res.json({ message: "Room joined successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
export default { getRooms, postRooms, getRoom, putRoom, deleteRoom, joinRoom };
