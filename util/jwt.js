const jwt=require('jsonwebtoken');

const createJWT=({payload})=>
{
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1d'});
    return token;
}

const isTokenValid=({token})=>jwt.verify(token,process.env.JWT_SECRET);

                              // res,tokenuser
const attachCookiesToResponse=({res,user})=>{
    
    
    const token=createJWT({payload:user});
    const oneday=1000*60*60*24;
    res.cookie('token',token,{
        httpOnly:true,
        expiresIn:new Date(Date.now()+oneday),
        secure:process.env.NODE_ENV==='production',
        signed:true
    })
}
module.exports={createJWT,isTokenValid,attachCookiesToResponse};