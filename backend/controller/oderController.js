const Order=require('../models/oderModel')
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

exports.newOrder=catchAsyncError(async(req,res,next)=>{
    

    const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order=await Order.create({shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user:req.user._id,
   paidAt:Date.now(),});

    res.status(201).json({
    success: true,
    order,
  });
})


// Get single order-ADMIN

exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{

    const order=await Order.findById(req.params.id).populate("user",'name email');

    if(!order)
    {
        return next(new ErrorHandler(`No order with this ${req.params.id},404`));
    }

    res.status(200).json({
        success:true,
        order
    })
})

exports.myOrders=catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    })
})

// admin route // will also calculate total amount 
exports.getAllOrders=catchAsyncError(async(req,res,next)=>{

    const orders=await Order.find({});
    
    let totalAmount=0;

    orders.forEach((order)=>totalAmount+=order.totalPrice);

     res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

exports.updateOrder=catchAsyncError(async(req,res,next)=>{

    const order=await Order.findById(req.params.id);

    
    if(!order)
    {
        return next(new ErrorHandler(`No order with this ${req.params.id},404`));
    }

      if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  
  
  if(req.body.status==='Shipped')
  {
    order.orderItems.forEach(async(order)=>{
    await updateStock(order.product,order.quantity);
  })
  }
  
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({validateBeforeSave:false});

   res.status(200).json({
        success:true,
        order
    })
})

async function updateStock(id,quantity)
{
    const product=await Product.findById(id);

    product.Stock=product.Stock-quantity;

    await product.save({validateBeforeSave:false});
}


// delete Order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await Order.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",

  });
});