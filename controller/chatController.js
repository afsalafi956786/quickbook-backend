import chatModel from "../models/chatShema.js";

export async function createChat(req,res){
      try{
        const chat=await chatModel.findOne({members:{$all:[req.body.senderId,req.body.receiverId]}})
        if(chat==null){
       const newChat=new chatModel({
        members:[req.body.senderId,req.body.receiverId]
    })
    const result= await newChat.save();
       res.json({status:'success',result})
        }else{
            const chated=await chatModel.findOne({members:{$all:[req.body.senderId,req.body.receiverId]}})
            res.json({status:'failed',chated})
        }

    }catch(error){
        console.log(error.message)
        res.json({ status: "failed", message: error.message });
    }

}


export async function vendorChat(req,res){
    try{

        
        const chat=await chatModel.find({
            members:{$in:[req.params.vendorId]}
        })
        res.json({status:'success',chat})
    }catch(error){
        res.json({ status: "failed", message: error.message }); 
    }
}

export async function findChat(req,res){
try{
    const chat=await chatModel.findOne({
        members:{$all:[req.params.firstId,req.params.secondId]}
    })
    res.json({status:'success',chat})

}catch(error){
    res.json({ status: "failed", message: error.message }); 
}
}