import mongoose from "mongoose";

const userShema=new mongoose.Schema({
    name:{type:String,
        required:true,
        trim:true
    },
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
    
    phone:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        // required:true,
        trim:true,  
    },
    isBanned:{
        type:Boolean,default:false
    }

},{
    timestamps:true
})

const userModel=mongoose.model('user',userShema)
export default userModel