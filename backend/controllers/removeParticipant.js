import asyncHandler from "../middlewares/asynchHandler.js";
import Room from "../models/rooms.js";
import User from "../models/user.js";




const removeParticipant = asyncHandler(async(req,res)=>{

  const {_id} = req.body;

  const {name} = req.params;

  try {

    const user= await User.findOne({username:name});
    if(!user) return res.status(404).json({error:"User not found!"});


    const result = await Room.updateOne({_id},{$pull:{participants:user._id}},{new:true})

    if(!result) return res.status(404).json({error:"Room not found"});
    
    res.status(200).json({result:result});
  } 
  catch (error) {
    return res.status(500).json({error:error.message})
  }
    
});


export default removeParticipant;