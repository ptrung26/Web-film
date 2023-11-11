import jsonwebtoken from "jsonwebtoken";
import userModel from "../models/userModel.js";
import responseHandler from "../handlers/responseHandler.js";

const signup = async (req, res) => {
  try {
    const { username, password, color } = req.body;
    const checkUser = await userModel.findOne({ username });
    if (checkUser)
      return responseHandler.badrequest(res, "username already used");

    const user = new userModel();

    user.username = username;
    user.password = password;
    user.displayname = "";
    user.color = color;

    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel
      .findOne({ username })
      .select("username password id displayname");

    if (!user) return responseHandler.badrequest(res, "User not exist");

    if (user.password !== password)
      return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch (err) {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (user.password !== password)
      return responseHandler.badrequest(res, "Wrong password");

    user.password = password;

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword,
};
