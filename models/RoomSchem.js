import mongoose, { Schema } from 'mongoose';

const RoomShema=new mongoose.Schema({
    vendorId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'vendor'
        
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
     state:{
        type:String
     },
     zip:{
        type:String
     },
     img:{
        type:Array
     },
     
    propertyType:{
        type:String
    },

    description:{
        type:String, 
    },
    price:{
        type:String,
    },
    capacity:{
        type:String,
    },
    totalRoomRate:{
        type:String,
    },
    totalrooms:{
        type:String,
    },
    AdultsRate:{
        type:String
    },
    location:{
        type:String
    },
    longitude:{
        type:String
    },
    latitude:{
        type:Number
    },
    category:{
        type:String
    },
    amenities:{
        type:Array
    },
    parking:{
        type:String
    },
    swimmingPool:{
        type:String
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    isRejected:{
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    }


},
{
    timestamps:true,
}
)
const RoomModel=mongoose.model('rooms',RoomShema)
export default RoomModel;