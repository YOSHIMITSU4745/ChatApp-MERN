import asyncHandler from "../middlewares/asynchHandler.js";
import Room from '../models/rooms.js'
import {Message} from '../models/message.js'
import User from "../models/user.js";


const deleteUser = asyncHandler(async(req,res)=>{


    const id = req.params.id || req.user._id;



    try {

        await Room.updateMany({participants:id},{$pull:{participants:id}});

        await Room.deleteMany({author:id});

        await Message.deleteMany({sender:id});

        const deleted = await User.findByIdAndDelete(id);


        return res.status(200).json(deleted);
        
        
    } catch (err) {
        
       return res.status(500).json({error:err.message});
    }

});


export default deleteUser;