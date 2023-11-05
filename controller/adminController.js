import bcrypt, { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminShema.js";
import userModel from "../models/userShema.js";
import RoomModel from "../models/RoomSchem.js";
import vendorModel from "../models/vendorShema.js";
import notificationModel from "../models/notificationSchema.js";
import bookingModel from "../models/bookingSchema.js";
import moment from "moment/moment.js";

export async function adminLogin(req, res) {
  try {
    let obj = req.body;
    console.log(obj);
    let regEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (obj.email && obj.password) {
      if (regEmail.test(obj.email)) {
        let admin = await adminModel.findOne({ email: obj.email });
        if (admin) {
          const isMatch = await bcrypt.compare(obj.password, admin.password);
          if (isMatch) {
            const adminId = admin._id;
            const token = jwt.sign({ adminId }, process.env.TOKEN_KEY, {
              expiresIn: "24h",
            });
            res.json({
              status: "success",
              message: "signin success",
              token: token,
            });
          } else {
            res.json({ status: "failed", message: "Incorrect password !" });
          }
        } else {
          res.json({ status: "failed", message: "Email not registered" });
        }
      } else {
        res.json({ status: "failed", message: "Please Enter a valid email !" });
      }
    } else {
      res.json({ status: "failed", message: "All fieldsa are required" });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function adminDetails(req, res) {
  try {
    let adminDatas = await adminModel.findById(req.adminId);
    res.json({ adminDatas, auth: true });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
}

//finding users
export async function findUser(req, res) {
  try {
    let users = await userModel.find({});
    res.json({ users });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

//update user status
export async function getStatus(req, res) {
  try {
    const { isBanned, userId } = req.body;
    await userModel.findByIdAndUpdate(userId, { isBanned: isBanned });
    res.json({ status: "failed", message: "success", userId, isBanned });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}
//get room details
export async function getRoomData(req, res) {
  try {
    const property = await RoomModel.find({ isApproved: false}).populate(
      "vendorId"
    );
    console.log(property);
    res.json({ status: "success", message: "got room details", property });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
}
//property approvel
export async function propertyApprove(req, res) {
  try {
    const { roomId } = req.body;
    await RoomModel.findByIdAndUpdate(roomId, { isApproved: true });
    res.json({ status: "success", message: "Approved succssfully" });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

  // export async function propertyReject(req,res){
  //   try{
  //       const {roomId}=req.body;
  //       await RoomModel.findByIdAndUpdate(roomId,{isRejected:true})
  //       res.json({'status':'success','message':'Rejected succssfully'})
  //   }catch(error){
  //       res.json({status:'failed',message:error.message})
  //   }
  // }

//get proptery detials
export async function getOneRoom(req, res) {
  try {
    const roomId = req.params.roomId;
    const room = await RoomModel.findById(roomId).populate("vendorId");
    res.json(room);
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function getProperties(req, res) {
  try {
    const roomInfo = await RoomModel.find({ isApproved: true }).populate(
      "vendorId"
    );
    res.json(roomInfo);
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

//get property status
export async function getPropertystatus(req, res) {
  try {
    const { isBanned, roomId } = req.body;
    await RoomModel.findByIdAndUpdate(roomId, { isBanned: isBanned });
    res.json({ status: "success", message: "success ", roomId, isBanned });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function getallusersCount(req,res){
  try{
    ////
   const usersCount=await userModel.find({}).count();
   const proeprties=await vendorModel.find().count();
   const totalrevenue=await bookingModel.aggregate([
    {
      $group:{
        _id:null,
        total:{$sum:'$total'}

      }
    }
   ])
  //  const newrev=await bookingModel.aggregate([
  //   {

  //     $group:{
  //       _id:"$userId",
  //       total: {$sum:'$total'},
  //     }
      
  //   }
  //  ])
  //  console.log(newrev)
  // const precentages=newrev.reduce((acc,curr)=>(acc+=curr.total*0.20),0)
  // console.log(precentages)
  // console.log(percentage)
   res.json({usersCount,proeprties,totalrevenue})
   

  }catch(error){
    res.json({ status: "failed", message: error.message });
  }
}

export async function getAllnotification(req,res){
  try{
     const notifications=await notificationModel.find().sort({createdAt: -1})
     res.json({notifications})
  }catch(error){
    res.json({ status: "failed", message: error.message });
  }
}

export async function deleteNotificationId(req,res){
  try{
    const notificationId=req.params.notificationId;
    await notificationModel.findByIdAndDelete(notificationId)
    res.json({status:'success'})
  }catch(error){
    res.json({ status: "failed", message: error.message });
  }
}

export async function getAdminGraph(req,res){
  try{
   let adminRevenue=await bookingModel.aggregate([
    {
      $project:{ _id:0,createdAt:1, total:1 }
  }
   ])
   adminRevenue= adminRevenue.filter(obj=>{
    obj.createdAt = moment(obj.createdAt).format('MMMM');
    return obj
})
let month = [ 'January', 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August', 'September' , 'October' , 'November' , 'December' ]
for (let i = 0; i < month.length; i++) {
  let f = 0
  adminRevenue.map((obj)=>{
      if (obj.createdAt === month[i]) {
          f = f + obj.total
      }
  })
  month[i] = f
}
res.json({totalRevenue:month})
  }catch(error){
    console.log(error.message)
    res.json({ status: "failed", message: error.message });
  }
}