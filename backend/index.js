import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser';
import path from 'path'
import userRoutes from './routes/userRoutes.js'
import titleRoutes from './routes/titleRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import cors from 'cors'

//files
import connectdb from './config/db.js';


//config
dotenv.config();
// console.log("Cloudinary config check:", {
//   name: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: process.env.CLOUDINARY_API_SECRET 
// });

connectdb();



const port = process.env.PORT || 3001;
const app = express();

const allowedCors = ["https://chatapp-frontend-6jnr.onrender.com"];

app.use(cors({origin:allowedCors,
    credentials:true
}))


const __dirname = path.resolve();

//middlewares

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//routes

app.use('/api/v1/users' , userRoutes)
app.use('/api/v1/rooms' , roomRoutes)
app.use('/api/v1/title' , titleRoutes)
app.use('/api/v1/message' , messageRoutes)



// app.use(express.static(path.join(__dirname ,"/frontend/dist" )))








app.listen(port , ()=>{console.log(`listening to port ${port}`)});