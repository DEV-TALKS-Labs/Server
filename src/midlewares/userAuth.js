import { decode } from "next-auth/jwt";

const userAuth = async (req, res, next) => {
  let { authorization: token } = req.headers;
  if (!token) {
    token = req.cookies["next-auth.session-token"];
  }
  if (!token) {
    console.log("no token");
    return res.status(409).send({ error: "invalid Tocken" });
  }

  try {
    const decodingKey = process.env.NEXTAUTH_SECRET;
    const decodedToken = await decode({ token, secret: decodingKey });
    req.body.id = decodedToken.id;
    return next();
  } catch (error) {
    return res.status(409).send({ error: "invalid Tocken" });
  }
};

export default userAuth;
