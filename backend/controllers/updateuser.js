import asyncHandler from "../middlewares/asynchHandler.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedpassword;
    }

    const updateduser = await user.save();

    res.json({
      id: updateduser.id,
      username: updateduser.username,
      email: updateduser.email,
      isAdmin: updateduser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found!");
  }
});

export default updateUser;
