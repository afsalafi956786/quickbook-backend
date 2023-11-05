import mongoose from "mongoose";

const adminShema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:[6],
    },
})
const adminModel=mongoose.model('admin',adminShema)
export default adminModel;