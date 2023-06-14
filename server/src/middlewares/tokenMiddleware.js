import jsonwebtoken from "jsonwebtoken";
import userModel from "../models/userModel.js";

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    }

    return false;
  } catch {
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);
  if (!tokenDecoded)
    return res.json({
      status: 401,
      message: "Unathorized",
    });

  const user = await userModel.findById(tokenDecoded.data);

  if (!user)
    return res.json({
      status: 401,
      message: "Unathorized",
    });

  req.user = user;
  next();
};

export default { auth, tokenDecode };
