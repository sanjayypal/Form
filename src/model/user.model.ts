import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"username is required"],
            unique:true
        },
        email:{
            type:String,
            required:[true,"username is required"],
            unique:true
        },
        password:{
            type:String,
            required:[true,"username is required"]
        },
        isVarified:{
            type:Boolean,
            default:false
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
         
    },{timestamps:true})

    const User = mongoose.models.users || mongoose.model("user",userSchema)

    export default User