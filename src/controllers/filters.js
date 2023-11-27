import prisma from "../libs/prisma.js";

const getFilters = async (req, res) => {
  try {
    const filters = await prisma.filter.findMany();
    return res.json(filters);
  } catch (error) {
    console.error("Error fetching filters:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const getFilterRooms = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = await prisma.filter.findUnique({
      where: {
        id,
      },
      include: {
        Rooms: true,
      },
    });

    if (!filter) {
      return res.status(404).send({
        error: "Filter not found",
      });
    }
    return res.json(filter.Rooms);
  } catch (error) {
    console.error("Error fetching filters:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export default { getFilters, getFilterRooms };
