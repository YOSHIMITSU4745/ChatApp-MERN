import asyncHandler from "../middlewares/asynchHandler.js";
import { Message } from "../models/message.js";
import Room from "../models/rooms.js";



const deleteRoom = asyncHandler(async(req,res)=>{

    const {id} = req.params;

    try {
        
        const room = await Room.findByIdAndDelete(id);
    
        if(!room) return res.status(404).json({error:"Room Not Found!"})
        

        const result = await Message.deleteMany({roomid:id});    
            
        res.status(200).json({room:room , message:result});    
    } 
    catch (err) {
    
        return res.status(500).json({error:err.message});
    }

});


export default deleteRoom;