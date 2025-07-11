import asyncHandler from "../middlewares/asynchHandler.js";
import { Message } from "../models/message.js";




const createMessage = asyncHandler(async(req,res)=>{
    const {roomid , sender , content} = req.body

    if(!roomid || !sender || !content) return res.status(400).json({error:"Fields are empty!"});

    try {
        
        const newmsg = new Message({roomid,sender,content})
        const created = await newmsg.save();

        if(!created)
            res.status(400).json({error:"Cant create message!"});

        return res.status(201).json(created)

    } catch (error) {
        console.error(error)
        return res.status(500).json({error:"Internal server error in creating message!"});
    }
})




const getByRoomid = asyncHandler(async(req,res)=>{
    const {id} = req.params

    try {
        
        const msgs = await Message.find({roomid:id}).populate('sender','username');
        
        return res.json(msgs);
    } catch (error) {
        console.error(error)
        return res.status(500).json({error:"INternal Server error at getting msgs!"})
    }
});

const updateMessage = asyncHandler(async(req,res)=>{
    const {content} = req.body
    const {id} = req.params

    try {
        
        const msg = await Message.findById(id);
        if(!msg) return res.status(404).json({error:"No Such Message found"});

        msg.content = content?content:msg.content
        const updatedMessage = await msg.save()
        return res.status(200).json(updatedMessage);

    } catch (error) {
        console.error(error)
        return res.status(500).json({error:"Internal server error during editing message"})
    }
})


const deleteMessage = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        
        const deletedmsg = await Message.findByIdAndDelete(id)
        if(!deletedmsg)
            return res.status(404).json({error:"No such message found!"})
        return res.status(200).json(deletedmsg)
    } catch (err) {
        console.error(err)
        return res.status(500).json({error:"Internal server Error while deleting message"})
        
    }
})


const getByUserid = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        
        const messages = await Message.find({sender:id}).sort({createdAt:-1}).limit(5).populate('roomid sender');
        
        return res.status(200).json(messages)

    } catch (err) {
        return res.status(500).json({error:err.message})
        
    }
})

const getMessageCount = asyncHandler(async(req,res)=>{

    try {
        

        const count  = await Message.countDocuments();

        return res.status(200).json({count})


    } catch (err) {

        return res.status(500).json({error:err.message})
        
    }
})
export {createMessage ,getByRoomid ,updateMessage ,deleteMessage ,getByUserid , getMessageCount};