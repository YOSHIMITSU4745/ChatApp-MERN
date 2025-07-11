import asyncHandler from "../middlewares/asynchHandler.js";
import Title from "../models/title.js";


 

 const updateTitle = asyncHandler(async(req,res)=>{


    try {
        
        const {name} = req.body;
        const {id}= req.params;
    
    
        const title = await Title.findById(id);
        if(!title)
            return res.status(404).json({error:"title not found!"});
    
        title.name = name?name:title.name;
    
        const updated = await title.save()

        return res.json(updated);
        
    } catch (error) {
        console.error(error);
       return res.status(500).json({error:"Internal server error in updating tittle"});
    }
 });

 export default updateTitle;