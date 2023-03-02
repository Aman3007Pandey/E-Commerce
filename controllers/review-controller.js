const {StausCodes, StatusCodes}=require('http-status-codes');
const checkPermission=require('../util/checkPermission');
const CustomError=require('../errors');

const Review=require('../models/review-model');
const Product=require('../models/product-model');


const getAllReview=async(req,res)=>{
    
    const review=await Review.find({});

    res.status(StatusCodes.OK).json({review,count:review.length});
}

const getReview=async(req,res)=>{
     
    const {id:reviewId}=req.params;

    const review=await Review.findById({_id:reviewId});
    
    console.log('aad');
    if(!review)
    {
        throw new CustomError.NotFoundError(`No Review with this ${reviewId} ID present.`)
    }

    res.status(StatusCodes.OK).json({review});

}
const createReview=async(req,res)=>{
    const{product:productId}=req.body;

    const isValidProduct=await Product.findById({_id:productId});

    if(!isValidProduct)
    {
        throw new CustomError.NotFoundError(`No product found with this ${productId} ID.`);
    }

    const alreadySubmitted=await Review.findOne({user:req.user.id,product:productId});

    if(alreadySubmitted)
    {
        throw new CustomError.BadRequestError('Product Review Already Submiited.');
    }

    req.body.user=req.user.id;

    const review=await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review});
}
const updateReview=async(req,res)=>{
    res.send('Update review');
}
const deleteReview=async(req,res)=>{
    const {id:reviewId}=req.params;
    
    let review;
    review=await Review.findById({_id:reviewId});
    
    if(!review)
    {
        throw new CustomError.NotFoundError(`No Review with this ${reviewId} ID present.`)
    }

    checkPermission(req.user,review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({message:'Review Removed. '});
}

module.exports={getAllReview,getReview,createReview,deleteReview,updateReview};