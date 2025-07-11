import asyncHandler from "../middlewares/asynchHandler.js";
import Title from "../models/title.js";


const createTitle = asyncHandler(async(req,res)=>{

    const {name} = req.body;
    if(!name)
    {
     
        throw new Error("please provide a name for title!");
    }

    const newtitle = new Title({name:name});

    try {
        
        await newtitle.save();
        res.status(201).json({id:newtitle._id , name:newtitle.name});

    } catch (error) {
        res.status(400);
        throw new Error("Invalid tittle!");
    }
})


export default createTitle;