import { v2 as cloudinary } from "cloudinary";

console.log("Config being set:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const initCloudinary = () =>{

    cloudinary.config({                            
        //dnoovg4g2
        cloud_name : "dnoovg4g2",                  
        //713773134952258 //process.env.CLOUDINARY_API_KEY
        api_key : process.env.CLOUDINARY_API_KEY,               
        //VYZRCXh5Ek3l-Di5vJe1oQn769g  //process.env.CLOUDINARY_API_SECRET
        api_secret :process.env.CLOUDINARY_API_SECRET ,
    });
    console.log("cloudinary has been configed!");
}
export default cloudinary;