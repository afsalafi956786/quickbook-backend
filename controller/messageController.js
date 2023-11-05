import messageModel from "../models/messageSchema.js";

export async function addMessage(req,res){
    try{
        const {chatId,senderId,text}=req.body
        const message=new messageModel({
            chatId,
            senderId,
            text
        })
        const result= await message.save();
       res.status(200).json(result)
    }catch(error){
        res.json({ status: "failed", message: error.message });
    }
}

export async function getMessages(req,res){
    try{
        const {chatId}=req.params;
        const result=await messageModel.find({chatId})
        res.json({status:'success',result})

    }catch(error){
        res.json({ status: "failed", message: error.message });
    }

}