const CustomError=require('../errors');
const {isTokenValid}=require('../util');

const authenticateUser=async(req,res,next)=>{
    const token=req.signedCookies.token;
    
    if(!token)
    {
        throw new CustomError.UnauthenticatedError('No token present');
    }

    try {
           const {name,id,role}=isTokenValid({token});
           req.user={name,id,role};
           next();
 
    } catch (error) {
                throw new CustomError.UnauthenticatedError('No token present');

    }

}

const authorizePermission=(...roles)=>{
    return(req,res,next)=>{

        if(!roles.includes(req.user.role))
        {
                    throw new CustomError.UnauthorizedError('Not Allowed To Access this Route');

        }
    
    next();
    }
}

module.exports={authenticateUser,authorizePermission};