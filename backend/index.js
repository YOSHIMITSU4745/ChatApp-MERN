import express from 'express'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import path from 'path'
import userRoutes from './routes/userRoutes.js'
import titleRoutes from './routes/titleRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { fileURLToPath } from 'url';

//files
import connectdb from './config/db.js';

//config
dotenv.config();
connectdb();



const port = process.env.PORT || 3001;
const app = express();



//middlewares

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//routes

app.use('/api/v1/users' , userRoutes)
app.use('/api/v1/rooms' , roomRoutes)
app.use('/api/v1/title' , titleRoutes)
app.use('/api/v1/message' , messageRoutes)





const __dirname = path.resolve();

console.log('dirname', __dirname)



app.listen(port , ()=>{console.log(`listening to port ${port}`)});