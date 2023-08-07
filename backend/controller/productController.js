const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError=require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apifeatures");
const cloudinary=require('cloudinary');

// Create Product -- Admin
exports.createProduct =catchAsyncError(async (req, res, next) => {

  let images=[];

  if(typeof req.body.images==='string')
  {
    images.push(req.body.images);
  }
  else
  {
    images=req.body.images;
  }

  const imagesLinks=[];

  for(let i=0;i<images.length;i++)
  {
    const result=await cloudinary.v2.uploader.upload(images[i],{
      folder:"products"
    })

    imagesLinks.push({
      public_id:result.public_id,
      url:result.secure_url
    })
  }


req.body.images=imagesLinks;

req.body.user=req.user.id;

const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts =catchAsyncError( async (req, res, next) => {

  const resultPerPage=8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    productsCount,
    filteredProductsCount,
    products,
    resultPerPage
  });
});

// Get All Products ->Admin

exports.getAdminProducts =catchAsyncError( async (req, res, next) => {

  const products=await Product.find({});

  res.status(200).json({
    success: true,
    products,
    
  });
});


// Get Product Details
exports.getProductDetails =catchAsyncError( async (req, res, next) => {

  const {id}=req.params;
  const product=await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
 
  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

exports.updateProduct =catchAsyncError( async (req, res, next) => {
  
   let product = await Product.findById(req.params.id);
   
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  
  //Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

exports.deleteProduct =catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  
  for(let i=0;i<product.images.length;i++)
  {
     await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await Product.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

exports.createProductReview=catchAsyncError(async(req,res,next)=>{
  
  const{rating,comment,productId}=req.body;

  const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
  }

  const product=await Product.findById(productId);



   const isReviewed=product.reviews.find(
    (rev)=>rev.user.toString()===req.user._id.toString()
   );
   


   if(isReviewed)
   {
    product.reviews.forEach((rev)=>{
      if(rev.user.toString()===req.user._id.toString())
      {
        rev.rating=rating;
        rev.comment=comment;
      }
    })
   }
   else
   {   
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
      
   }


  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  //console.log(avg);

  await product.save({validateBeforeSave:false});

  res.status(200).json({
    success:true,
    product
  })
})

exports.getProductReviews=catchAsyncError(async(req,res,next)=>{

  const product=await Product.findById(req.query.id); // productId

  if(!product)
  {
    return next(new ErrorHandler("Product Not Found",404));
  }

  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })
})

exports.deleteReview=catchAsyncError(async(req,res,next)=>{

  const product=await Product.findById(req.query.productId);
  
   if(!product)
  {
    return next(new ErrorHandler("Product Not Found",404));
  }
  

  // id->reviewId
  const filteredReviews=product.reviews.filter((rev)=>rev._id.toString()!==req.query.reviewId.toString());

  let avg=0;
  filteredReviews.forEach((rev)=>{
    avg+=rev.rating;
  })
  
  let ratings=0;
  if(filteredReviews.length===0)
  {ratings=0;
  }
  else{
    ratings=avg/filteredReviews.length;
  }

  const numOfReviews=filteredReviews.length;

  await Product.findByIdAndUpdate(req.query.productId,{
    reviews:filteredReviews,ratings,numOfReviews,
  },{new:true,runValidators:true,useFindAndModify:false});

  res.status(200).json({
    success:true,
  });

})

