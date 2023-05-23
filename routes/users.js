import express from "express";
const router=express.Router();
import {  SignupValidate,getPropertyType,getfilterCategories,getFilterAmenities,singninValidate,userDataFetch,userCheck,userProfile,changePass,getRoomDetails,getDispalyRoom,getlocalLocation,createBooking,successData ,bookingData,canceleBook,userReview,getRoomReview,getallCoupons,getcoupenApply,getUsersId,getBookingDates} from "../controller/userController.js";
import { verifyJWT } from "../middleware/auth.js";





router.post('/user_check',userCheck)
router.post('/user_signup',SignupValidate)
router.get('/user_data',verifyJWT,userDataFetch)
router.post('/user_signin',singninValidate)
router.patch('/editProfile',verifyJWT,userProfile)
router.patch('/editpassword',verifyJWT,changePass)
router.get('/getRoomdetails',getRoomDetails)
router.get('/getDetails/:roomId',getDispalyRoom)
router.get('/getLocation',getlocalLocation)
// router.get('/continue',getContinueBook)
router.post('/createbooking',verifyJWT,createBooking)
router.get('/successData/:roomId',verifyJWT,successData)
router.get('/bookingData',verifyJWT,bookingData)
router.post('/cancelbooking',canceleBook)
router.post('/review',verifyJWT,userReview)
router.get('/getReiviews/:roomId',verifyJWT,getRoomReview)
router.get('/getCoupon/:vendorId',getallCoupons)
router.post('/coupnapply',verifyJWT,getcoupenApply)
router.get('/users/:userId',getUsersId)
router.get('/getDates/:roomId',getBookingDates)
router.post('/getAmenities',verifyJWT,getFilterAmenities)
router.post('/getCategories',verifyJWT,getfilterCategories)
router.post('/getType',verifyJWT,getPropertyType)





export default router;