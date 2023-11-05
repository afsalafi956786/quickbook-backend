import mongoose, { Schema } from "mongoose";

const couponShema=new mongoose.Schema({
 
    vendorId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'vendor'
    },
    couponCode:{
        type:String,
    },
    discount:{
        type:Number
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    users:[{
        type:Schema.Types.ObjectId,
        ref:'users'
    }],
    isExpire:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
})
const couponModel=mongoose.model('coupon',couponShema)
export default couponModel