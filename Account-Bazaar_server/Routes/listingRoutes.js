import express from "express"
import upload from "../configs/multer.js"
import { authProtect } from "../middleware/authMiddleware.js"
import { addCredential, addListing, deleteUserListing, getAllPublicListing, getAllUserListing, getAllUserOrders, markedFeatured, purchaseAccount, toggleStatus, updateListing, withdrawnAmount } from "../controllers/listingContoller.js"

const listingRouter = express.Router()
listingRouter.post('/',upload.array("images",5),authProtect,addListing)
listingRouter.put('/',upload.array("images",5),authProtect,updateListing)
listingRouter.get('/public', getAllPublicListing)
listingRouter.get('/user',authProtect, getAllUserListing)
listingRouter.put('/:id/status',authProtect, toggleStatus)
listingRouter.delete('/:listingId',authProtect, deleteUserListing)
listingRouter.post('/add-credential',authProtect, addCredential)
listingRouter.put('/featured/:id',authProtect, markedFeatured)
listingRouter.get('/user-orders',authProtect, getAllUserOrders)
listingRouter.post('/withdraw',authProtect, withdrawnAmount)
listingRouter.post('/purchase-account/:listingId',authProtect, purchaseAccount)


export default listingRouter
