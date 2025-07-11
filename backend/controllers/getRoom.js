import asyncHandler from "../middlewares/asynchHandler.js";
import Room from "../models/rooms.js";



const getRoom = asyncHandler(async(req,res)=>{

    const {id} = req.params;

    const room = await Room.findById(id).populate('title','name').populate('participants','username').populate('author','username');

    if(!room) return res.status(404).json({error:"Room Not Found!"})

    res.status(200).json(room);    

});


export default getRoom;