import prisma from "../libs/prisma.js";

const postUser = async (req, res) => {
  try {
    //TODO pass name, imageUrl from fronted
    const { id, name, imageUrl } = req.body;
    console.log(id, name, imageUrl);
    const user = await prisma.user.create({
      data: {
        id,
        name,
        imageUrl,
      },
    });

    return res.status(201).send({ user: "user created" });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(200).send({ user: "user created" });
    }
    console.log(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
export default { postUser };
