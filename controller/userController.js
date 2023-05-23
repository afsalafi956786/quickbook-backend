// import userModel from "../models/userShema";
import userModel from "../models/userShema.js";
import bcrypt, { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import RoomModel from "../models/RoomSchem.js";
import bookingModel from "../models/bookingSchema.js";
import reviewModel from "../models/reviewSchema.js";
import couponModel from "../models/couponShema.js";
import moment from "moment/moment.js";
import vendorModel from "../models/vendorShema.js";

export async function userCheck(req, res) {
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
      obj.mobile
    ) {
      if (regName.test(obj.name)) {
        if (regEmail.test(obj.email)) {
          if (obj.password === obj.confirmPass) {
            if (mob.test(obj.mobile)) {
              let user = await userModel.findOne({ email: obj.email });
              if (!user) {
                let phoneNumber = await userModel.findOne({
                  phone: obj.mobile,
                });
                if (!phoneNumber) {
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
              res.json({
                staus: "failed",
                message: "Enter a valid phone number",
              });
            }
          } else {
            res.json({ staus: "failed", message: "password is not matched" });
          }
        } else {
          res.json({ status: "failed", message: "Enter a valid email" });
        }
      } else {
        res.json({ status: "failed", message: "Enter a valid name" });
      }
    } else {
      res.json({ status: "failed", message: "All fieldsa are required" });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

//user signup validation
export async function SignupValidate(req, res) {
  try {
    const obj = req.body;
    if (
      !obj.name &&
      obj.email &&
      obj.password &&
      obj.confirmPass &&
      obj.mobile
    ) {
      res.json({ status: "failed", message: "All fields are required !" });
    } else {
      let existUser = await userModel.findOne({ email: obj.email });
      if (existUser) {
        res.json({ status: "failed", message: "Email is already taken " });
      } else {
        const userDetails = obj;
        if (userDetails.password == userDetails.confirmPass) {
          userDetails.password = await bcrypt.hash(userDetails.password, 10);

          await userModel.create({
            name: userDetails.name,
            email: userDetails.email,
            password: userDetails.password,
            phone: userDetails.mobile,
          });
          let userInfo = await userModel.findOne({ email: userDetails.email });
          let userId = userInfo._id;

          const token = jwt.sign({ userId }, process.env.TOKEN_KEY, {
            expiresIn: "2h",
          });
          res.json({
            status: "success",
            message: "signup success",
            token: token,
          });
        } else {
          res.json({ status: "failed", message: "password is not matched" });
        }
      }
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

//user login validatin
export async function singninValidate(req, res) {
  try {
    let obj = req.body;
    if (!obj.email && obj.password) {
      res.json({ status: "failed", message: "All fields are required !" });
    } else {
      let user = await userModel.findOne({ email: obj.email });
      if (user) {
        if (user.isBanned) {
          res.json({ status: "failed", message: "You were banned few days" });
        } else {
          const isMatch = await bcrypt.compare(obj.password, user.password);
          if (isMatch) {
            const userId = user._id;
            const token = jwt.sign({ userId }, process.env.TOKEN_KEY, {
              expiresIn: "2h",
            });
            res.json({
              status: "success",
              message: "signin succecess",
              token: token,
            });
          } else {
            res.json({ status: "failed", message: "Incorrect password !" });
          }
        }
      } else {
        res.json({ status: "failed", message: "Email is not registered !" });
      }
    }
  } catch (error) {
  
    res.json({ status: "failed", message: error.message });
  }
}

export async function userDataFetch(req, res) {
  try {
    let userDetails = await userModel.findById(req.userId);
    res.json({ userDetails, auth: true });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
}
//user profile edit

export async function userProfile(req, res) {
  try {
    let obj = req.body;
    const updated = await userModel.findByIdAndUpdate(req.userId, {
      name: obj.name,
      email: obj.email,
      address: obj.address || null,
    });
    res.json({ status: "success", message: "updated successfully", updated });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function changePass(req, res) {
  try {
    let obj = req.body;

    let user = await userModel.findById(req.userId);
    if (obj.newPass == obj.confimPass) {
      console.log("kerri");
      let isMatch = await bcrypt.compare(obj.password, user.password);
      if (isMatch) {
        let newPassword = await bcrypt.hash(obj.newPass, 10);
        await userModel.findByIdAndUpdate(req.userId, {
          password: newPassword,
        });
      }
      res.json({ status: "success", message: "updated successfully" });
    } else {
      res.json({ status: "failed", message: "Password not matched" });
    }
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

//display room details fetch
export async function getRoomDetails(req, res) {
  try {
    let roomData = await RoomModel.find({ isBanned: false,isApproved:true}).populate(
      "vendorId"
    );
    res.json({ status: "success", roomData });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

//dispaly room details
export async function getDispalyRoom(req, res) {
  try {
    const roomId = req.params.roomId;
    const room = await RoomModel.findById(roomId).populate("vendorId");
    res.json(room);
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function getlocalLocation(req, res) {
  try {
    const loc = req.query.place;
    const gotLocations = await RoomModel.find({ location: loc });
    res.json(gotLocations);
  } catch (error) {
    console.log(error);
    res.json({ status: "failed", message: error.message });
  }
}

export async function createBooking(req, res) {
  try {
    const userId = req.userId;
    let obj = req.body;
    console.log(obj.vendorId, "id obj vanu");
    let booked = await bookingModel.create({
      roomId: obj.roomId,
      userId: userId,
      vendorId: obj.vendorId,
      address: obj.address,
      phone: obj.phone,
      place: obj.place,
      adult: obj.adult,
      checkIn: obj.check_in,
      checkOut: obj.check_out,
      rooms: obj.roomCount,
      location: obj.location,
      RoomPrice: obj.price,
      type: obj.type,
      total: obj.total,
      days: obj.dayCount,
      // img1:obj.img1,
      // img2:obj.img2,
    });

    // let rooms=await RoomModel.findById(obj.roomId)
    // rooms.totalrooms=rooms.totalrooms-obj.rooms
    // rooms.save()

    res.json({ status: "success", booked });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function successData(req, res) {
  try {
    const roomId = req.params.roomId;
    const userId = req.userId;
    const roomInfo = await RoomModel.findById(roomId).populate("vendorId");
    res.json(roomInfo);
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function bookingData(req, res) {
  try {
    const userId = req.userId;
    const bookedRooms = await bookingModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("roomId")
      .populate("vendorId");
    console.log(bookedRooms);
    res.json({ bookedRooms });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function canceleBook(req, res) {
  try {
    let { bookId } = req.body;
    let cancel = await bookingModel.findByIdAndUpdate(bookId, {
      isCancel: true,
    });
    res.json({
      status: "success",
      message: "Your room has been cancelled !!",
      cancel,
    });
  } catch (error) {
    res.json({ status: "failed", message: error.message });
  }
}

export async function userReview(req, res) {
  try {
    let userId = req.userId;
    let { roomId, feedback, stars, vendorId } = req.body;
    let user = await reviewModel.findOne({ userId: userId, roomId: roomId });
    if (user) {
      res.json({
        status: "false",
        message: "your review is already added",
        user,
      });
    } else {
      let review = await reviewModel.create({
        roomId: roomId,
        userId: userId,
        vendorId: vendorId,
        feedback: feedback,
        stars: stars,
      });

      res.json({
        status: "success",
        message: "your feedback is added",
        review,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
}

export async function getRoomReview(req, res) {
  try {
    let roomId = req.params.roomId;
    let userId = req.userId;
    let review = await reviewModel
      .find({ roomId: roomId })
      .sort({ createdAt: -1 })
      .populate("userId");
    res.json({ review });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
}

export async function getallCoupons(req, res) {
  try {
    let vendorId = req.params.vendorId;
    let coupon = await couponModel.find({ vendorId: vendorId });
    res.json({ coupon });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
}

export async function getcoupenApply(req, res) {
  try {
    let { couponCode, roomIds, vendorid } = req.body;
    let today = moment();
    let userId = req.userId;
    let coupon = await couponModel.findOne({ couponCode: couponCode });
    if (coupon) {
      let roomCoupon = await couponModel.findOne({ vendorId: vendorid });
      if (roomCoupon) {
        if (coupon.endDate >= today) {
          if (coupon.users.includes(userId) == false) {
            coupon.users.push(userId);
            coupon.save();
            res.json({
              status: "success",
              message: "coupon applied successfully",
              coupon,
            });
          } else {
            res.json({ status: "failed", message: "Coupon already used" });
          }
        } else {
          res.json({ statuse: "failed", message: " your Coupon is Expired" });
        }
      } else {
        res.json({ status: "failed", message: "Invalide coupon code" });
      }
    } else {
      res.json({ status: "failed", message: "Invalid coupon code" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ status: "failed", message: error.message });
  }
}

export async function getUsersId(req, res) {
  try {
    const userId = req.params.userId;
    const vendor = await vendorModel.findById(userId);
    res.json({ vendor });
  } catch (error) {
    return { status: "failed", message: "Network error" };
  }
}

export async function getBookingDates(req,res){
  try{
    const roomId=req.params.roomId
    const dates=await bookingModel.find({roomId:roomId})
    console.log(dates)
    res.json({dates})

  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}

export async function getFilterAmenities (req,res){
  let arr=[];
  try{
    // filter
    let obj=req.body;
    for (let key in obj) {
      if(obj[key] !==null){
        arr.push(obj[key])
      }
     
    }
    
    console.log(arr)
   let amenities= await RoomModel.find({'amenities':{$all:arr}})
   res.json({amenities})
  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}


export async function getfilterCategories(req,res){
  try{
   let {deluxe,laxuary,familyRoom,noramlRoom,classic}=req.body;
 let categories= await RoomModel.find({'category':{$in:[deluxe,laxuary,familyRoom,noramlRoom,classic]}}).populate('vendorId')
   res.json({categories})
  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}



export async function getPropertyType(req,res){
  try{
   let {Hotel,Resort,HomeStay}=req.body;
 let type= await RoomModel.find({'propertyType':{$in:[Hotel,HomeStay,Resort]}}).populate('vendorId')
   res.json({type})
  }catch(error){
    return { status: "failed", message: "Network error" };
  }
}