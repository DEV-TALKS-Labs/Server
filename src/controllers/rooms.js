import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export default { getRooms };
