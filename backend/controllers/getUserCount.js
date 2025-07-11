import asyncHandler from "../middlewares/asynchHandler.js";
import User from "../models/user.js";

const getUserCount = asyncHandler(async(req,res)=>{
    try {
        
        const count = await User.countDocuments();
        res.status(200).json({count});

    } catch (err) {

        res.status(500).json({error:err.message})
        
    }
})


export default getUserCount;