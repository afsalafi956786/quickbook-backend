import mongoose, { mongo } from 'mongoose';

const vendorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
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
        minlength:[6]
    },
    propertyName:{
        type:String,
        required:true,
        trim:true,
    
    },
    propertyLocation:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,

    },
    isBanned:{
        type:Boolean,default:false
    }

},{
    timestamps:true
})
const vendorModel=mongoose.model('vendor',vendorSchema)
export default vendorModel