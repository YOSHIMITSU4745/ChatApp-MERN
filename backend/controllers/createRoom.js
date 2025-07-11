import asyncHandler from "../middlewares/asynchHandler.js";
import User from "../models/user.js";
import Title from "../models/title.js";
import Room from "../models/rooms.js";
import bcrypt from "bcryptjs";

export const createRoom  = asyncHandler(async(req,res)=>{

    const {name , author , password , participants ,title,description} = req.body;
    if(!name || !author || !title)
    {
        return res.send("please fill required fields!");
    }

    const existingroom = await Room.findOne({name:name});
    

    if(existingroom)
        return res.status(400).send("room already exists");

    const authuser = await User.findById(author);
   

    const partusers = await User.find({_id:{$in:participants}});
    const titlename = await Title.find({_id:title});

    let hashedPassword="";
    if(password)
    {
        const salt =await bcrypt.genSalt(10);
        hashedPassword =await bcrypt.hash(password,salt);
    }
    if(!titlename)
        return res.status(400).send("NO such title available!");



    const newroom = new Room({name , author , password:hashedPassword, participants , title ,description});

    try {
        
        await newroom.save();
        res.status(201).json({
            name:newroom.name,
            title:newroom.title,
            password:newroom.password,
            participants:newroom.participants,
            author:newroom.author,
            description:newroom.description
        })

    } catch (error) {
       return res.status(400).send("Invalid Room Data!");
        
    }

    
   
})