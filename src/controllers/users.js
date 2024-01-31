import prisma from "../libs/prisma.js";
import { z } from "zod";

const postUser = async (req, res) => {
  const postUserSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(255),
    imageUrl: z.string().url(),
  });
  const validatePostUser = postUserSchema.safeParse(req.body);
  if (!validatePostUser.success)
    return res.status(400).json({ message: validatePostUser.error.issues[0] });
  try {
    const { id, name, imageUrl } = req.body;
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
