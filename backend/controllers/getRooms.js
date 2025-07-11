import asyncHandler from "../middlewares/asynchHandler.js";
import Room from "../models/rooms.js";


const getRooms = asyncHandler(async(req,res)=>{

    const rooms = await Room.find()
    .populate('author','username email')
    .populate('participants','username email')
    .populate('title','name');
    res.status(200).json(rooms);
})

export default getRooms;