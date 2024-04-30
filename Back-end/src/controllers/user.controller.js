import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const generateAccessAndRefreshToken = async (userId) => {
   try {
    const user =await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken}
   } catch (error) {
    throw new ApiError(500,"something went wrong while generating access token and refresh token")
   }

}

const registerUser = asyncHandler( async (req, res) => {
    //take data from frontend
    //validation
    //check for user/email is exist or not
    //create user object - db call
    //remove password and refresh token field
    //check for user creation 
    //return res

    const {username,fullname,email,password} = req.body
    
    //validation
    if(!username){
        throw new ApiError(400,"username is required")
    }
    if(!fullname){
        throw new ApiError(400,"username is required")
    }
    if(!email){
        throw new ApiError(400,"username is required")
    }
    if(!password){
        throw new ApiError(400,"username is required")
    }
   console.log("fullname : ",fullname,email,username,password)

    //check user already exist or not
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"user already exist with this username/email")
    }

    const user = await User.create({
        fullname,
        // avatar: avatar.url,
        // coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    
    const createdUser = await User.findById(user._id,{password:0})

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,createdUser,"user created successfully")
    )

})


const loginUser = asyncHandler(async (req,res)=>{
    //take data from input
    //field validation
    //authentication for username
    //authentication for password
    //return res

    const {username,password} = req.body
    if(!username){
        throw new ApiError(400,"username is required")
    }
    
    const user = await User.findOne({username})
    if(!user)
    {
        throw new ApiError(400,"user with this username doesn't exist")
    }

    if(!password){
        throw new ApiError(400,"password is required")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400,"Incorrect password")
    }

    const {accessToken,refreshToken} =await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id,{password:0})

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id).select("-password -refreshToken")
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect)
    {
        throw new ApiError(400,"Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))
})

const updateProfile = asyncHandler(async(req,res)=>{
    const {fullname,email} = req.body

    if(!fullname && !email)
    {
        throw new ApiError(400,"Either fullname or email is required")
    }
    
    const user = await User.findById(req.user?._id).select("-password -refreshToken")
    user.fullname = fullname
    user.email = email
    await user.save({validateBeforeSave:false})


    return res
    .status(200)
    .json(new ApiResponse(200,user,"profile updated successfully"))
})


export {
    registerUser,
    loginUser,
    changeCurrentPassword,
    updateProfile
}