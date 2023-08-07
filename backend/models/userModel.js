const mongoose=require('mongoose');
const validator=require('validator');
const brcypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');


const userSchema=new mongoose.Schema({
     name: {
    type: String,
    required: [true, "Please Enter your Name"],
  maxLength:[30,"Name cannot exceed 30 characters"],
minLength:[3,"Name should have more than 4 characters"],
},
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
    unique:true,
    validate:[validator.isEmail,"please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password "],
    minLength: [7, "Password should be greater than  8 characters"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  createdAt:{
    type:Date,
    default:Date.now
  },

  resetPasswordToken:String,
  resetPasswordExpire:String,
});


userSchema.pre("save",async function(next){

  if(!this.isModified("password"))
  {
    next();
  }

  this.password=await brcypt.hash(this.password,10);
});

userSchema.methods.getJWTToken=function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
}

userSchema.methods.comparePassword=async function(enteredPassword){
return await brcypt.compare(enteredPassword,this.password);
}

userSchema.methods.getResetPasswordToken=function(){

  const resetToken=crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  
  this.resetPasswordExpire=Date.now()+10*60*1000;
  return resetToken;
}
module.exports=mongoose.model("User",userSchema);