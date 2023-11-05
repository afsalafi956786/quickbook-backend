
import mongoose, { Schema } from "mongoose";

const notificationSchema=new mongoose.Schema({
    message:{
        type:String
    },
    notification:{
        type:String
    },
    status:{
        type:String
    }
},
{
    timestamps:true,
}
)

const notificationmodel=mongoose.model('notifications',notificationSchema)
export default notificationmodel