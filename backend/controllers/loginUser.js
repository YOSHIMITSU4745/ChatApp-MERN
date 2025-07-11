import User from "../models/user.js";
import asyncHandler from "../middlewares/asynchHandler.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/createToken.js";

const loginUser =asyncHandler(async(req,res)=>{

    const {email , password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser)
    {
        const isPasswordValid = await bcrypt.compare(password , existingUser.password);
        if(isPasswordValid){
            generateToken(res,existingUser._id);
            res.status(201).json({
                id:existingUser._id,
                username:existingUser.username,
                email:existingUser.email,
                password:existingUser.password,
                isAdmin:existingUser.isAdmin,
              
                
            })
        }

        else{
            res.status(401).json({message:"Invalid Password!"});
        }
    }

    else{
        res.status(401).json({message:"User Not Found"});
    }
});


export default loginUser;

