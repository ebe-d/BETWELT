const mongoose=require('mongoose');

const userSchema=new mongoose.Schema(
{
    clerkId:{
        type:String,
        required:true,
        unique:true
    }
    ,
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    balance:{
        type:Number,
        default:0
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},
{timestamps:true}
);

const User=mongoose.model('User',userSchema);
module.exports=User;
