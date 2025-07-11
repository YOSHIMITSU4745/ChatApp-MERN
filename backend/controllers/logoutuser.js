import asyncHandler from "../middlewares/asynchHandler.js";


const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie("jwt" , "" ,{
        httpOnly:true,
        expires:new Date(0),
    });

    res.status(200).json({
        message:"Logged Out Successfully!",
    });
})


export default logoutUser;