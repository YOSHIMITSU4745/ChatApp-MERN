
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asynchHandler.js";
import generateToken from "../utils/createToken.js";


const createUser = asyncHandler(async(req,res)=>{
    const {username ,email , password} = req.body;
    
    // console.log(username );
    // console.log(email);
    // console.log(password);

    if(!username || !password || !email){

       return res.status(400).send("please fill all fields!");
        
    }

    const userExists = await User.findOne({email});

    if(userExists) return res.status(400).send("user already exists");

    //hash password now user doesnot exists already so create new save in db

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    
    const newUser = new User({username:username , email:email , password:hashedPassword});
    
    try {

        await newUser.save();
        //create token for login authentication
        generateToken(res,newUser._id);

        return res.status(201).json({
            id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            isAdmin:newUser.isAdmin,
        });


        
    } catch (error) {
        return res.status(400).send("Invalid User Data!");
        
    }
});


export {createUser};