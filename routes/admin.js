import express from "express";
const router=express.Router();
import { getOneRoom,adminLogin,getAdminGraph,deleteNotificationId,getAllnotification,adminDetails,getallusersCount,findUser,getStatus,getRoomData,propertyApprove,getProperties,getPropertystatus} from "../controller/adminController.js";
import { adminJwt, vendorJWT } from "../middleware/auth.js";




router.post('/adminSignin',adminLogin)
router.get('/adminData',adminJwt,adminDetails)
router.get('/userDetails',findUser)
router.post('/userStatus',getStatus)
router.get('/roomDetails',adminJwt,getRoomData)
router.post('/propertyApprovel',propertyApprove)
// router.post('/propertyReject',propertyReject)
router.get('/getoneroom/:roomId',getOneRoom)
router.get('/getProperties',adminJwt,getProperties)
router.post('/getPropertyStatus',getPropertystatus)
router.get('/getUsercount',adminJwt,getallusersCount)
router.get('/getnotification',getAllnotification)
router.delete('/getnotification/:notificationId',deleteNotificationId)
router.get('/getadminGraph',getAdminGraph)


export default router;