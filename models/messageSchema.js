import mongoose from "mongoose";

const messageShema=new mongoose.Schema({
    chatId:{
        type:String,

    },
    senderId:{
        type:String,
    },
    text:{
        type:String,
    },
},{
    timestamps:true,
});

const messageModel=mongoose.model('message',messageShema)
export default messageModel