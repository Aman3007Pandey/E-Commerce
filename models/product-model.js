const mongoose=require('mongoose');
const User=require('./user-model');
const productSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true,maxlength:100},
    price:{type:Number,required:true},
    description:{type:String,required:true,maxlength:1000},
    image:{type:String,default:'uploads/gow.jpg'},
    category:{type:String,required:true,enum:['office','kitchen','bedroom']},
    company:{type:[],required:true},
    colors:{type:[String],required:true},
    featured:{type:Boolean,required:true,default:false},
    freeShipping:{type:Boolean,required:true,default:false},
    inventory:{type:Number,required:true,default:15},
    rating:{type:Number,required:true,default:0},
    user:{type:mongoose.Types.ObjectId,ref:'User',required:true}
},
{timestamps:true})

module.exports=mongoose.model('Product-E-Commerce',productSchema);