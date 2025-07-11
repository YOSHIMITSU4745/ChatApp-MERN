import asyncHandler from "../middlewares/asynchHandler.js";
import Room from "../models/rooms.js";


const getJoinedRooms = asyncHandler(async(req,res)=>{

    try {
        
        const rooms = await Room.find({participants:req.user._id}).populate("author participants title");
        res.json(rooms);

    } catch (error) {
        res.status(500).json({error:error.message});
    }
    
    

});


export default getJoinedRooms