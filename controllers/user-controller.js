const User=require('../models/user-model');
const {StatusCodes}=require('http-status-codes');
const CustomError=require('../errors');
const createTokenUser=require('../util/createTokenUser');
const { attachCookiesToResponse,checkPermission } = require('../util');
const getAllUser=async(req,res)=>{
    
    const user=await User.find({role:'user'}).select('-password');
    
    res.status(StatusCodes.OK).json({user});
}
const getUser=async(req,res)=>{
    
    console.log(req.user);
    const id=req.params.id;
    const user=await User.findById({_id:id}).select('-password'); 
    // property:value

    if(!user)
    {
        throw new CustomError.NotFoundError('No user with current ID');
    }


    checkPermission(req.user,user._id);
    res.status(StatusCodes.OK).json({user});
}
const showCurrentUser=async(req,res)=>{
    res.status(StatusCodes.OK).json({user:req.user});
}
const updateUser=async(req,res)=>{
    
    const {name,email}=req.body;
    if(!name || !email)
    {
        throw new CustomError.BadRequestError('Please provide name and email');
    }

    const user=await User.findByIdAndUpdate({_id:req.user.id},{name,email},{new:true,runValidators:true});

    const tokenUser=createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({user:tokenUser});

}
const updateUserPassword=async(req,res)=>{
    const{oldPassword,newPassword}=req.body;

    if(!oldPassword || !newPassword)
    {
        throw new CustomError.BadRequestError('Please Provide old and new Password');
    }

    const user=await User.findOne({_id:req.user.id});

    const isOldPasswordCorrect=await user.comparePassword(oldPassword);

    if(!isOldPasswordCorrect)
    {
        throw new CustomError.UnauthenticatedError('please provide valid credentials');
    }

    user.password=newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({message:'Password Updated!'});
}

module.exports={getAllUser,getUser,updateUser,updateUserPassword,showCurrentUser};