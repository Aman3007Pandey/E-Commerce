const CustomError=require('../errors');
const checkPermission=(requestUser,resourceUserId)=>{
    // console.log(requestUser);
    // console.log(resourceUserId);
    // console.log(typeof resourceUserId);

    if(requestUser.role==='admin')
    {
        return;
    }

    if(resourceUserId.toString()===requestUser.id)
    {
        return;
    }

    throw new CustomError.UnauthorizedError('Not Allowed to access this route')
}

module.exports=checkPermission;