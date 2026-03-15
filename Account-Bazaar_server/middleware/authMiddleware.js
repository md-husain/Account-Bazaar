import { clerkClient } from "@clerk/express";

export const authProtect = async (req,res,next) =>{
    try {
        
        const {userId , has}  = await req.auth();

        if(!userId){
            return res.status(401).json({ message: "Unauthorized Access"})
        }

        const hasPremiumPlan = await has({plan: 'premium'})
        req.plan = hasPremiumPlan ? 'premium' : 'free'
        return next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: error.code || error.message})
    }
}


export const authProtectAdmin = async (req,res,next) =>{
    try {
        
        const user  = await clerkClient.users.getUser(req.auth().userId);
         
        const isAdmin = process.env.ADMIN_EMAILS.split(",").includes(user.emailAddresses[0].emailAddress)
        if(!isAdmin){
            return res.status(401).json({message: "Unauthorized"})
        }
        return next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: error.code || error.message})
    }
}