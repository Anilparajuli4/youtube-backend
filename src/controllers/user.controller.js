import User from "../models/User.Model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const userRegister= asyncHandler(async(req, res)=>{
    const {fullname, email, username, password} = req.body
   if(
    [fullname, email, username, password].some((field)=> field?.trim()==='')
   ){
    throw new ApiError(400, 'All fields are required')
   }

   const existedUser = User.findOne({$or:[{username}, {email}]})
   if(existedUser){
     throw new ApiError(409, 'User with email or username already exists')
   }
   const avatarLocalpath =req?.files.avatar[0]?.path
   const coverImageLocalpath =req?.files?.coverImage[0]?.path

   if(!avatarLocalpath){
     throw new ApiError(400, 'Avatar file is required')
   }
   const avatar = await uploadOnCloudinary(avatarLocalpath)
   const coverImage = await uploadOnCloudinary(coverImageLocalpath)
   if(!avatar){
    throw new ApiError(400, 'avatar image is not uploaded')
   }
   const user = await User.create({
    fullname,
    avatar:avatar.url,
    email,
    coverImage:coverImage?.url || '',
    password,
    username:username.toLowerCase()
   })
   const createUser = await User.findById(user._id).select("-password -refreshToken")
   if(createUser){
    throw new ApiError(500, 'something went wrong during registration')
   }
   return res.status(200).json(
    new ApiResponse(201, createUser, 'user register successfull')
   )
})


