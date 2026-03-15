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
        
        const {userId}  = await req.auth();

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