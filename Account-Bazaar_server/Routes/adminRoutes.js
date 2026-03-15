import express from "express"
import { authProtect, authProtectAdmin } from "../middleware/authMiddleware.js"
import { changeCredential, changeStatus, getAllListings, getAllTransactions, getAllUnChangedListings, getAllUnverifiedListings, getAllWithdrawRequests, getcredential, getDashboard, isAdmin, markCredentialVerified, markWithdrawalAsPaid } from "../controllers/adminController.js"

const adminRouter = express.Router()
adminRouter.get('/',authProtectAdmin,isAdmin)
adminRouter.get('/dashboard',authProtectAdmin,getDashboard)
adminRouter.get('/all-listings',authProtectAdmin,getAllListings)
adminRouter.get('/unverified-listings',authProtectAdmin,getAllUnverifiedListings)
adminRouter.get('/credential/:listingId',authProtectAdmin,getcredential)
adminRouter.get('/unchanged-listings',authProtectAdmin,getAllUnChangedListings)
adminRouter.get('/withdraw-requests',authProtectAdmin,getAllWithdrawRequests)
adminRouter.get('/transactions',authProtectAdmin,getAllTransactions)

adminRouter.put('/change-status/:listingId',authProtectAdmin,changeStatus)
adminRouter.put('/verify-credential/:listingId',authProtectAdmin,markCredentialVerified)
adminRouter.put('/change-crediential/:listingId',authProtectAdmin,changeCredential)
adminRouter.put('/withdrawal-mark/:id',authProtectAdmin,markWithdrawalAsPaid)
export default adminRouter
