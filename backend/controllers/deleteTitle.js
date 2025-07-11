import asyncHandler from "../middlewares/asynchHandler.js";
import Title from "../models/title.js";

   


const deleteTitle = asyncHandler(async(req,res)=>{

    try {
        
        
            const {id} = req.params;
            const title = await Title.findByIdAndDelete(id);
        
            if(!title)
                return res.status(404).json({error:"Title Not Found!"});

            res.json(title);

    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal server error on deleting title!"})
        
    }

    
});

export default deleteTitle;