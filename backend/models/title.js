import mongoose from "mongoose";


const titleSchema = mongoose.Schema({
    name:{type:String , required:true , unique:true}
})

const Title = mongoose.model('Title' ,titleSchema);

export default Title;