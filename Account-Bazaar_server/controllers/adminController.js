//  check is user admin or not

import { prisma } from "../configs/prisma.js"

export const isAdmin = async (req,res) =>{
    try {
        return res.json({isAdmin: true})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

//  to get admin dashboard

export const getDashboard = async (req,res) =>{
    try {
        const totalListing = await prisma.listing.count({})
        const transactions = await prisma.transaction.findMany({
            where: {isPaid: true},
            select: {amount: true},
        })
       
        const totalRevenue = transactions.reduce((total, transaction)=>total + transaction.amount,0)
        const activeListings = await prisma.listing.count({
            where: {status: "active"}
        })

        const totalUser = await prisma.user.count({})
        const recantListings = await prisma.listing.findMany({
            orderBy: { createdAt: "desc"},
            take: 5,
            include: { owner: true},
        })
        return res.json({dashboardData: {totalListing,totalRevenue,activeListings,totalUser,recantListings}})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}


// get all listings

export const getAllListings = async (req,res) =>{
    try {
        const listings = await prisma.listing.findMany({
            include: {owner: true},
            orderBy: {createdAt: "desc"},
        })

        if(!listings || listings.length === 0){
            return res.json({listings:[]})
        }
       
        return res.json({listings})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}


// change listings status

export const changeStatus = async (req,res) =>{
    try {
        const {listingId} = req.params
        const {status} = req.body

        const listing = await prisma.listing.findUnique({
            where: {id: listingId},
        })

        if(!listing){
            return res.status(404).json({message:"Listing not found"})
        }
        await prisma.listing.update({
            where: {id: listingId},
            data: {status}
        })

        return res.json({message: "Listing status updated"})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

// getting all unverified listings with credentials submitted

export const getAllUnverifiedListings = async (req,res) =>{
    try {
        const listings = await prisma.listing.findMany({
            where: {
                isCredentialSubmitted: true,
                isCredentialVerified: true,
                status: {not: "deleted"}
            },
            orderBy: {createdAt: "desc"},
        })

        if(!listings || listings.length === 0){
            return res.json({listings:[]})
        }
       
        return res.json({listings})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

// getting credentials

export const getcredential = async (req,res) =>{
    try {
         const {listingId} = req.params
         const credential = await prisma.credential.findFirst({
            where: {
               listingId
            }
        })

        if(!credential ){
            return res.status(404).json({message: "Credential not found"})
        }
       
        return res.json({credential})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

// mark credential verified

export const markCredentialVerified = async (req,res) =>{
    try {
         const {listingId} = req.params
         await prisma.listing.update({
            where: {
               id: listingId
            },
            data: {
                isCredentialVerified: true
            }
        })
        return res.json({message: 'credential marked as verified'})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

// get all un-changed listinngs
export const getAllUnChangedListings = async (req,res) =>{
    try {
        const listings = await prisma.listing.findMany({
            where: {
                isCredentialVerified: true,
                isCredentialChanged: true,
                status: {not: "deleted"}
            },
            orderBy: {createdAt: "desc"},
        })

        if(!listings || listings.length === 0){
            return res.json({listings:[]})
        }
       
        return res.json({listings})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

// change credential for verified listing
export const changeCredential = async (req,res) =>{
    try {
         const {listingId} = req.params
         const {newCredential, credentialId} = req.body

         await prisma.credential.update({
            where: {
               id:credentialId, listingId
            },
            data: {
                updatedCredential: newCredential
            }
        })
        await prisma.listing.update({
            where: {
               id: listingId
            },
            data: {
                isCredentialChanged: true
            }
        })
        return res.json({message: 'credential changed successfullly'})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

// get all transactions
export const getAllTransactions = async (req,res) =>{
    try {
        const transactions = await prisma.transaction.findMany({
            where : {isPaid:true},
            orderBy: {createdAt: "desc"},
            include: {listing:{include: {owner: true}}},
        })

        // get customer details for each transaction and add it to the transaction object

         const customers = await prisma.user.findMany({
            where : {id:{in: transactions.map((tnx)=>tnx.userId)}},
            select: {id:true,email:true,name:true,image:true}
        })
        transactions.forEach((tnx)=>{
            const customer = customers.find((c)=>c.id === tnx.userId)
            tnx.listing.customer = {...customer}
        }) 

        if(!transactions || transactions.length === 0){
            return res.json({transactions:[]})
        }
       
        return res.json({transactions})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}


// getting all withdraw requests
export const getAllWithdrawRequests = async (req,res) =>{
    try {
        const requests = await prisma.withdrawal.findMany({
            orderBy: {createdAt: "desc"},
            include: {user: true},
        })

        if(!requests || requests.length === 0){
            return res.json({requests:[]})
        }
       
        return res.json({requests})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}

// mark withdrwal as paid

export const markWithdrawalAsPaid = async (req,res) =>{
    try {
         const {id} = req.params
        const withdrawal =  await prisma.withdrawal.findUnique({
            where: {
               id
            }
        })
        if(!withdrawal){
           return res.status(404).json({message: 'withdrwal not found '})
        }
        if(withdrawal.isWithdrawn){
           return res.status(400).json({message: 'withdrwal already marked as paid  '})
        }
        
         await prisma.withdrawal.update({
            where: {
               id
            },
            data: {
                isWithdrawn: true
            }
        })

        return res.json({message: 'Withdrawal marked as verified'})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.code || error.message})
    }
}