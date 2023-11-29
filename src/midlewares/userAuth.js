import { jwtDecode } from "jwt-decode";

const userAuth = async (req, res, next) => {
  const { authorization: token } = req.headers;
  try {
    const decoded = jwtDecode(token.split(" ")[1]);
    if (!decoded.sub) return res.status(409).send({ error: "invalid Tocken" });
    req.body.id = decoded.sub;
    next();
  } catch (error) {
    return res.status(409).send({ error: "invalid Tocken" });
  }
};

export default userAuth;
