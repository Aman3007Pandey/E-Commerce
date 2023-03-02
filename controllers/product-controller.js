const Product=require('../models/product-model');
const {stat, StatusCodes}=require('http-status-codes');
const CustomError=require('../errors');
const path=require('path');

const createProduct=async(req,res)=>{
    req.body.user=req.user.id; // in the product model user field is given value,user.id
    const product=await Product.create(req.body);
    res.status(StatusCodes.OK).json({product});

}
const getAllProduct=async(req,res)=>{
    
    const products=await Product.find({});
    res.status(StatusCodes.OK).json({products,count:products.length});
}
const getProduct=async(req,res)=>{
    const {id:productId}=req.params;

    const product=await Product.findOne({_id:productId});

    if(!product)
    {
        throw new CustomError.NotFoundError(`No product with ${productId} product ID`);
    }
    res.status(StatusCodes.OK).json({product});
}


const updateProduct=async(req,res)=>{
    const{id:productId}=req.params;

    const prodcut=await Product.findOneAndReplace({_id:productId},req.body,{new:true,runValidators:true});

    if(!product)
    {
        throw new CustomError.NotFoundError(`No product with ${productId} product ID`);
    }
    
    res.status(StatusCodes.OK).json({product});
}
const deleteProduct=async(req,res)=>{
    const{id:productId}=req.params;

    const product=await Product.findOne({_id:productId});

    if(!product)
    {
        throw new CustomError.NotFoundError(`No product with ${productId} product ID`);
    }
    
    await product.remove();

    res.status(StatusCodes.OK).json({message:'Product Removed !'});
}
const uploadProductImage=async(req,res)=>{

    //console.log(req.files);

    if(!req.files)
    {
        throw new CustomError.NotFoundError('No Image Uploaded');
    }

    const productImage=req.files.images;

    if(!productImage.mimetype.startsWith('image'))
    {
         throw new CustomError.NotFoundError('Please upload Image');
    }

    const imagePath=path.join(__dirname,'../public/uploads/'+`${productImage.name}`);

    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({image:`uploads/${productImage.name}`});
}

module.exports={createProduct,getAllProduct,getProduct,deleteProduct,updateProduct,uploadProductImage};