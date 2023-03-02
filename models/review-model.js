const mongoose=require('mongoose');
const User=require('../models/user-model');
const Product=require('../models/product-model');

const reviewSchema=new mongoose.Schema({
    rating:{
       type:Number,
       min:1,
       max:5,
       required:[true,'please provide rating']
    },
    title:{
       type:String,
       trim:true,
       maxlength:50,
       required:[true,'please provide title'],
    },
    comment:{
       type:String

    },

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true,
    }
},{timestamps:true});

reviewSchema.index({user:1,product:1},{unique:true});
module.exports=mongoose.model('Review-E-commerce',reviewSchema);