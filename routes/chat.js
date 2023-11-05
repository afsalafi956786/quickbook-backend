import express from "express";
import { createChat, findChat, vendorChat } from "../controller/chatController.js";
const router=express.Router();

router.post('/',createChat)
router.get('/:vendorId',vendorChat)
router.get('/find/:firstId/:secondId',findChat)


export default router