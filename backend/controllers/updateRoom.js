import asyncHandler from "../middlewares/asynchHandler.js";
import Room from '../models/rooms.js'
import bcrypt from 'bcryptjs'
  
  const updateRoom = asyncHandler(async(req,res)=>{


    const {author ,name , password , title , description ,participants ,ispublic} = req.body
    const {id} = req.params

    
    
    try {
        
        const room = await Room.findOne({_id:id});
        if(!room) return res.status(404).json({error:"NO room found!"});

        room.name = name?name:room.name
        room.author = author?author:room.author
        room.title = title?title:room.title
        room.participants = participants?participants:room.participants
        room.description = description?description:room.description

        if(password && !ispublic)
        {
            const salt =await bcrypt.genSalt(10);
            const hashedPassword =await bcrypt.hash(password,salt);
            room.password = hashedPassword;
        }

        if(ispublic)
            password="";

        const updatedroom = await room.save();

        return res.status(200).json(updatedroom);

        



    } catch (error) {
        
        console.error(error);
        return res.status(500).json({error:"Internal Server Error (updateRoom)"})
    }
  });

  export default updateRoom;