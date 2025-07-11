import User from "../models/user.js";
import asyncHandler from "./asynchHandler.js";
import jwt from "jsonwebtoken";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userID).select("-password");
      next();

    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized , Token Failed!");
    }
  }

  else{
    res.status(401);
    throw new Error("No Token!");
  }
});

const authorizeAdmin = (req,res,next) =>{
    if(req.user && req.user.isAdmin){
        next();
    }
    else{
        res.status(401).send("Not Authorized as Admin!");
    }
};

export {authenticate,authorizeAdmin};
