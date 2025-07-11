import asyncHandler from "../middlewares/asynchHandler.js";
import Room from "../models/rooms.js";

const getRoomCount = asyncHandler(async(req,res)=>{
    try {
        
        const count = await Room.countDocuments();
        res.status(200).json({count});

    } catch (err) {

        res.status(500).json({error:err.message})
        
    }
})


export default getRoomCount;