import { decode } from "next-auth/jwt";
const userAuth = async (req, res, next) => {
  const { authorization: token } = req.headers;
  try {
    const decodingKey = process.env.NEXTAUTH_SECRET;
    console.log(token);

    const decodedToken = await decode({ token, secret: decodingKey });
    console.log("decodedToken", decodedToken);
    req.body.id = decodedToken.id;
    next();
  } catch (error) {
    return res.status(409).send({ error: "invalid Tocken" });
  }
};

export default userAuth;
