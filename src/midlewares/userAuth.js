import { jwtDecode } from "jwt-decode";

const userAuth = async (req, res, next) => {
  const { token } = req.body;
  try {
    const decoded = jwtDecode(token);
    req.body.id = decoded.sub;
    next();
  } catch (error) {
    return res.status(409).send({ error: "invalid Tocken" });
  }
};

export default userAuth;
