import mongoose, { Schema } from "mongoose";


const reviewSchema=new mongoose.Schema({
    roomId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'rooms'
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    vendorId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'vendor'
    },
 
        userName:{
        type:String,
    },
    feedback:{
        type:String,
    },
    stars:{
        type:String
    },
  
},{
    timestamps:true,
})
const reviewModel=mongoose.model('review',reviewSchema)
export default reviewModel;