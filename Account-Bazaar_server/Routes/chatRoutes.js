import express from "express"
import upload from "../configs/multer.js"
import { authProtect } from "../middleware/authMiddleware.js"
import { getAllUserChat, getChat, sendChatMessage } from "../controllers/chatController.js"

const chatRouter = express.Router()
chatRouter.post('/',authProtect,getChat)
chatRouter.get('/user',authProtect,getAllUserChat)
chatRouter.post('/send-message',authProtect,sendChatMessage)

export default chatRouter
