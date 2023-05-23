import vendorModel from "../models/vendorShema.js";
import userModel from "../models/userShema.js";
import bcrypt, { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import RoomModel from "../models/RoomSchem.js";
import couponModel from "../models/couponShema.js";
import bookingModel from "../models/bookingSchema.js";
import mongoose from "mongoose";
import reviewModel from '../models/reviewSchema.js'
import moment from "moment/moment.js";
import notificationModel from "../models/notificationSchema.js";


export async function vendorCheck(req, res) {
  try {
    let obj = req.body;
    let regName = /^[a-zA-Z]+$/;
    let regEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let mob = /^([+]\d{2})?\d{10}$/;
    if (
      obj.name &&
      obj.email &&
      obj.password &&
      obj.confirmPass &&
      obj.phone &&
      obj.propertyName &&
      obj.propertyLocation
    ) {
      if (regName.test(obj.name)) {
        if (regEmail.test(obj.email)) {
          if (mob.test(obj.phone)) {
            if (obj.password === obj.confirmPass) {
              let vendor = await vendorModel.findOne({ email: obj.email });
              if (!vendor) {
                let mobileNumber = await vendorModel.findOne({
                  phone: obj.phone,
                });

                if (!mobileNumber) {
                  res.json({ status: "success", message: "approved" });
                } else {
                  res.json({
                    staus: "failed",
                    message: "phone number is already registered !",
                  });
                }
              } else {
                res.json({
                  status: "failed",
                  message: "email is already registered !",
                });
              }
            } else {
              res.json({ staus: "failed", message: "password is not matched" });
            }
          } else {
            res.json({
              staus: "failed",
              message: "Enter a valid phone number",
            });
          }
        } else {
          res.json({ status: "failed", message: "Enter a valid email" });
        }
      } else {
        res.json({ status: "failed", message: "Enter a valid name" });
      }
    } else {
      res.json({ status: "failed", message: "All fields are required !" });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function vendorSignup(req, res) {
  try {
    let obj = req.body;
    if (
      !obj.name &&
      obj.email &&
      obj.password &&
      obj.confirmPass &&
      obj.propertyname &&
      obj.propertylocation &&
      obj.phone
    ) {
      res.json({ status: "failed", message: "All fields are required !" });
    } else {
      let existVendor = await vendorModel.findOne({ email: obj.email });
      if (existVendor) {
        res.json({
          status: "failed",
          message: "Email is already registered !",
        });
      } else {
        const vendorDetails = obj;
        console.log(vendorDetails);
        if (vendorDetails.password == vendorDetails.confirmPass) {
          vendorDetails.password = await bcrypt.hash(
            vendorDetails.password,
            10
          );
          await vendorModel.create({
            name: vendorDetails.name,
            email: vendorDetails.email,
            password: vendorDetails.password,
            phone: vendorDetails.phone,
            propertyName: vendorDetails.propertyName,
            propertyLocation: vendorDetails.propertyLocation,
          });
          let vendorInfo = await vendorModel.findOne({
            email: vendorDetails.email,
          });
          let vendorId = vendorInfo._id;

          const token = jwt.sign({ vendorId }, process.env.TOKEN_KEY, {
            expiresIn: "2h",
          });
          res.json({
            status: "success",
            message: "signup success",
            token: token,
          });
        } else {
          res.json({ status: "failed", message: "Password is not mathced !" });
        }
      }
    }
  } catch (error) {
    res.json({ status: "failed", message: "error.message" });
  }
}

export async function vendorLogin(req, res) {
  try {
    let obj = req.body;
    if (obj.email && obj.password) {
      let vendor = await vendorModel.findOne({ email: obj.email });
      if (vendor) {
        const isMatch = await bcrypt.compare(obj.password, vendor.password);
        if (isMatch) {
          const vendorId = vendor._id;
          const token = jwt.sign({ vendorId }, process.env.TOKEN_KEY, {
            expiresIn: "2h",
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
        res.json({ status: "failed", message: "Email is not registered" });
      }
    } else {
      res.json({ status: "failed", message: "All fields are required" });
    }
  } catch (error) {
    console.log(error.message)
    res.json({ status: "failed", message: "error.message" });
  }
}
//vendor data
export async function vendorData(req, res) {
  try {
    let vendorDetails = await vendorModel.findById(req.vendorId);
    res.json({ vendorDetails, auth: true });
  } catch (error) {
    res.json({ status: "failed", message: "error.message" });
  }
}
//add room
export async function addRoom(req, res) {
  try {
    let obj = req.body;


    let vendorId = req.vendorId;
    let roomName=await vendorModel.findById(vendorId)
    const room = await RoomModel.create({
      vendorId: vendorId,
      propertyType: obj.property,
      totalrooms: obj.roomNo,
      capacity: obj.capacity,
      totalRoomRate: obj.OneRoom,
      price: obj.price,
      AdultsRate: obj.adultRate,
      address: obj.address,
      city: obj.city,
      state: obj.state,
      zip: obj.zip,
      description: obj.description,
      amenities: obj.amenities,
      img: obj.image,
      category: obj.category,
      parking: obj.parking,
      swimmingPool: obj.swimmingPool,
      longitude: obj.longitude,
      latitude: obj.latitude,
      location: obj.location,
    });
    await notificationModel.create({
      message:'Added compleated',
      notification:`Vendor successfully added the Room.please check the ` +roomName.propertyName+'...',
      status:'success'
    })
  


    res.json({ status: "success", message: "Room  added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: "error.message" });
  }
}

//fetch vendor id in roomModel
export async function getRoomview(req, res) {
  try {
    const roomView = await RoomModel.find({ vendorId: req.vendorId }).populate(
      "vendorId"
    );
    res.json({ roomView });
  } catch (error) {
    res.json({ status: "failed", message: "error.message" });
  }
}

//vendor data display using id
export async function getvendorRoom(req, res) {
  try {
    const roomId = req.params.roomId;
    const room = await RoomModel.findById(roomId).populate("vendorId");
    res.json(room);
  } catch (error) {
    res.json({ status: "failed", message: "error.message" });
  }
}

//edit room  data
export async function getEditRoom(req, res) {
  try {
    const editId = req.params.editId;
    console.log(editId);
    const editRoom = await RoomModel.findById(editId);
    res.json(editRoom);
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: "error.message" });
  }
}
//edit room
export async function editRoomData(req, res) {
  try {
    const obj = req.body;
    const roomId = req.params.roomId;
    const roomName=await RoomModel.findById(roomId).populate('vendorId')
    if (obj.image != "") {
      await RoomModel.findByIdAndUpdate(roomId, {
        img: obj.image,
      });
    }
    await RoomModel.findByIdAndUpdate(roomId, {
      propertyType: obj.property,
      totalrooms: obj.roomNo,
      capacity: obj.capacity,
      totalRoomRate: obj.OneRoom,
      price: obj.price,
      AdultsRate: obj.adultRate,
      address: obj.address,
      city: obj.city,
      state: obj.state,
      zip: obj.zip,
      description: obj.description,
      amenities: obj.amenities,
      category: obj.category,
      parking: obj.parking,
      swimmingPool: obj.swimmingPool,
      longitude: obj.longitude,
      latitude: obj.latitude,
      location: obj.location,
    });
    await notificationModel.create({
      message:'Updated the Room',
      notification:`Vendor have made some changes to the ` +roomName.vendorId.propertyName+'...',
      status:'warning'
    })
    res.json({ status: "success", message: "updated successfully" });
  } catch (error) {
    res.json({ status: "failed", message: "error.message" });
  }
}
//delete room
export async function delelteRoom(req, res) {
  try {
    const roomId = req.params.roomId;
    await RoomModel.findByIdAndDelete(roomId);
    // await notificationModel.create({
    //   message:'Deleted a Room',
    //   notification:`Vendor has been deleted the Room ` +roomName.vendorId.propertyName+'...',
    //   status:'danger'
    // })
    res.json({ status: "success", message: "deleted successfully" });
  } catch (error) {
    res.json({ status: "failed", message: "error.message" });
  }
}

//edit vendor profile
export async function editProfile(req, res) {
  try {
    const obj = req.body;
    let editVendor = await vendorModel.findByIdAndUpdate(req.vendorId, {
      name: obj.name,
      email: obj.email,
      image: obj.image || null,
      propertyName: obj.propertyName,
      propertyLocation: obj.propertyLocation,
    });
    await notificationModel.create({
      message:'Updated profile',
      notification: `${obj.name} hase been updated his profile `,
      status:'warning'
    })
    res.json({
      status: "success",
      message: "updated successfully",
      editVendor,
    });
  } catch (error) {
    console.log(error.message);
    return { status: "failed", message: "Network error" };
  }
}

export async function createCoupon(req, res) {
  try {
    let obj = req.body;
    let vendorId = req.vendorId;

    // const coupon=await couponModel.findOne({couponCode:obj.couponCode})
    // if(!coupen){
    // }

    let coupons = await couponModel.create({
      vendorId: vendorId,
      couponCode: obj.code,
      discount: obj.discount,
      startDate: obj.startDate,
      endDate: obj.endDate,
    });
    console.log(coupons);
    res.json({ status: "success", message: "your coupon is added", coupons });
  } catch (error) {
    console.log(error.message);
    return { status: "failed", message: "Network error" };
  }
}

export async function viewCoupons(req, res) {
  try {
    let couponShow = await couponModel.find({ vendorId: req.vendorId });
    res.json(couponShow);
  } catch (error) {
    return { status: "failed", message: "Network error" };
  }
}

export async function deleteCoupon(req, res) {
  try {
    let couponId = req.params.couponId;
    await couponModel.findByIdAndDelete(couponId);
    res.json({ status: "success", message: "deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return { status: "failed", message: "Network error" };
  }
}

export async function getallBookings(req, res) {
  try {
    let viewBookings = await bookingModel
      .find({ vendorId: req.vendorId })
      .populate("userId")
      .populate("roomId")
      .populate("userId");
    res.json({ viewBookings });
  } catch (error) {
    return { status: "failed", message: "Network error" };
  }
}

export async function getVendorId(req, res) {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    res.json({ user });
  } catch (error) {
    return { status: "failed", message: "Network error" };
  }
}

export async function vendorDashBoard(req,res){
  try{
    let vendorId = req.vendorId;
    let totalBookings=await bookingModel.find({vendorId,isCancel:false}).count()
    let getBookings=await bookingModel.find({vendorId}).populate('roomId').populate('vendorId').populate('userId').sort({createdAt: -1}).limit(5)
    const bookingAmount=await bookingModel.aggregate([
      {
        $match:{vendorId:mongoose.Types.ObjectId(vendorId)}
      },
      {
        $group:{
          _id:null,
          totalAmount:{$sum:'$total'}
        }
      }
      
    ]) 


    let customers =await bookingModel.distinct("userId",{vendorId})
    let customer=customers.length;
    let users=await bookingModel.find({vendorId})
    console.log(users.length)
    res.json({totalBookings,getBookings,bookAmount:bookingAmount[0].totalAmount,customer})
  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}

export async function fechroomDetails(req,res){
  try{
    const room=await RoomModel.find()
    res.json({room})
    
  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}

export async function fetchReviews(req,res){
  try{
    const vendorId=req.vendorId
    const reviews=await reviewModel.find({vendorId}).limit(3).populate('userId')
    res.json(reviews)
  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}

export async function vendorGraph(req,res){
  try{
    let vendorId=req.vendorId
    let totalRevenue=await bookingModel.aggregate([
      {
      $match:{vendorId:mongoose.Types.ObjectId(vendorId)}
      },{
        $project:{_id:0,createdAt:1,total:1}
      }
    ])
    totalRevenue=totalRevenue.filter(obj=>{
      obj.createdAt=moment(obj.createdAt).format('MMMM');
      return obj
    })

    let month=[ 'January', 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August', 'September' , 'October' , 'November' , 'December' ]
    for(let i=0;i<month.length;i++){
      let f=0
      totalRevenue.map((obj)=>{
        if(obj.createdAt === month[i]){
          f=f+obj.total
        }
      })
      month[i]=f
    }
    res.json({monthSalary:month})
    
    
  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}


// export async function getVendorSales(req,res){
//   try{
//     let vendorId=req.vendorId
//     // const salesReport=await bookingModel.aggregate([
//     //   {
//     //     $match: {
//     //       createdAt: { $gte: moment().startOf('month').format('YYYY-MM-DD') }
//     //     }
//     //   }
//     // ])
//     // console.log(salesReport,"fghjkhugfcv");
//     // console.log(moment().startOf('month').format('YYYY-MM-DD'));
//   }catch(error){
//     return { status: "failed", message: "Network error" };
//   }
// }