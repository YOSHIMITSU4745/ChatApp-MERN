import asyncHandler from "../middlewares/asynchHandler.js";
import User from "../models/user.js";


const allUsers = asyncHandler(async(req , res )=>{
    const users = await User.find();
    res.json(users);
})

export default allUsers;