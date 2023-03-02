const User=require('../models/user-model');
const StatusCodes=require('http-status-codes');
const customError=require('../errors');
const jwt =require('jsonwebtoken')
const{attachCookiesToResponse,createTokenUser} =require('../util')
const util=require('../util');


const login=async(req,res)=>{
    const{email,password}=req.body;

    if(!email || !password)
    {
        throw new customError.BadRequestError('Please provide email and password');
    }

    const  user=await User.findOne({email});

    if(!user)
    {
        throw new customError.UnauthenticatedError('No user with this ID');
    }
    
    const isCorrectPassword=await user.comparePassword(password);

    if(!isCorrectPassword)
    {
        throw new customError.UnauthenticatedError('Wrong email ID or password');
    }

    const tokenUser=createTokenUser(user);

    attachCookiesToResponse({res,user:tokenUser});
    res.status(200).json({user:tokenUser});

}

const register=async(req,res)=>{
    
    const {email,name,password}=req.body;

    const emailAlreadyInUse=await User.findOne({email});
    if(emailAlreadyInUse)
    {
        throw new customError.BadRequestError('Email Already In Use');
    }

    //set up first user as an admin
    
    const isFirstAccount=await User.countDocuments({})===0;
    const role=isFirstAccount?'admin':'user';
    const user=await User.create({name,email,password,role});
    const tokenUser=createTokenUser(user);

    attachCookiesToResponse({res,user:tokenUser});
    res.status(200).json({user:tokenUser});
}

const logout=async(req,res)=>{

    res.cookie('token','logout',{expire:new Date(Date.now())});
    res.status(200).send('User Successfully loggedd out!');
}

module.exports={login,register,logout};