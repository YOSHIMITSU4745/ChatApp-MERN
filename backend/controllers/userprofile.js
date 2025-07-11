import asyncHandler from "../middlewares/asynchHandler.js";
import User from "../models/user.js";

const userProfile = asyncHandler(async(req , res)=>{

    const user = await User.findById(req.user._id);
    if(user)
    {

        res.json({
            id:user._id,
            username:user.username,
            email:user.email,
        });
    }
    else
    {
        res.status(404);
        throw new Error("User Not Found!");
    }
});

export default userProfile;