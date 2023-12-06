import { decode } from "next-auth/jwt";

const userAuth = async (req, res, next) => {
  let { authorization: token } = req.headers;
  console.log("token", token);
  if (!token) {
    console.log(req.cookies);
    token = req.cookies["next-auth.session-token"];
    console.log(req);
    console.log("cookie token", token);
  }

  try {
    console.log(req.headers);
    const decodingKey = process.env.NEXTAUTH_SECRET;

    const decodedToken = await decode({ token, secret: decodingKey });

    req.body.id = decodedToken.id;
    next();
  } catch (error) {
    return res.status(409).send({ error: "invalid Tocken" });
  }
};

export default userAuth;
