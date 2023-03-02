const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const userSchema=new mongoose.Schema({
    name:{
       type:String,
       required:true,
       minlength:3,
       maxlength:50
    },
    email:{
       type:String,
       unique:true,
       required:[true,'please provide a email'],
       validate:{
         validator:validator.isEmail,
         message:'Please provide a valid email'
       }
    
    },
    password:{
       type:String,
       required:true,
       minlength:4
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'

    }
})

userSchema.pre('save',async function(){
    
    if(this.isModified('password'))
    {
      const salt=await bcrypt.genSalt(10);
      this.password=await bcrypt.hash(this.password,salt);
    }
})

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports=mongoose.model('User-Ecommerce',userSchema);