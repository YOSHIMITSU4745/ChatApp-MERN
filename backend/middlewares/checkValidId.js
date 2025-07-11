import mongoose from "mongoose";


const checkValidId = (req,res,next) =>{


    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({error:"Invalid Objectid formatt!"});

    next();
}

export default checkValidId;