import mongoose, { Schema } from 'mongoose';

const wishListSchema = new mongoose.Schema({
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
    
},{
    timestamps:true,
})


const wishListModel = mongoose.model('wishList',wishListSchema);
export default  wishListModel;