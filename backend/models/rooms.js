
import mongoose from "mongoose";

const roomSchema = mongoose.Schema({

    name:{type:String ,required:true},
    author:{type:mongoose.Schema.Types.ObjectId ,required:true ,  ref:'User'},
    password:{type:String  ,default:"" },
    participants:[{type:mongoose.Schema.Types.ObjectId , ref:'User'},],
    title:{type:mongoose.Schema.Types.ObjectId , ref:'Title',required:true},
    description:{type:String ,default:""}
    
},{timestamps:true});


const Room = mongoose.model('Room', roomSchema);

export default Room;