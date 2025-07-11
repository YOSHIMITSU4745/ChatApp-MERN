import asyncHandler from "../middlewares/asynchHandler.js";
import Title from "../models/title.js";



const getAllTitles = asyncHandler(async(req,res)=>{
    const titles =  await Title.find();
    if(titles)
    res.json(titles);

    else
    res.json({message:"no titles found!"})
})

export default getAllTitles;