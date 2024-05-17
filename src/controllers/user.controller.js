import { Long } from "mongodb";
import User from "../models/User.Model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessandRefreshToken = async(userId)=>{
    try {
       const user = await User.findById(userId)
       const jwtToken = user.generateJWTToken()
       const refreshToken = user.generateRefreshToken()
       user.refreshToken= refreshToken
       await user.save({
        validateBeforeSave:false
       })
       return {jwtToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

export const userRegister= asyncHandler(async(req, res)=>{
    const {fullName, email, username, password} = req.body
   if(
    [fullName, email, username, password].some((field)=> field?.trim()==='')
   ){
    throw new ApiError(400, 'All fields are required')
   }

   const existedUser = await User.findOne({$or:[{username}, {email}]})
   if(existedUser){
     throw new ApiError(409, 'User with email or username already exists')
   }
   const avatarLocalpath =req?.files?.avatar[0]?.path
//    const coverImageLocalpath =req?.files?.coverImage[0]?.path
let coverImageLocalPath
if(req.files && Array.isArray(req.files.coverImage) && req.files?.coverImage>0){
   coverImageLocalPath = req.files.coverImage[0].path
}
console.log(avatarLocalpath);
   if(!avatarLocalpath){
     throw new ApiError(400, 'Avatar file is required')
   }
   const avatar = await uploadOnCloudinary(avatarLocalpath)
   console.log(avatar);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar){
    throw new ApiError(400, 'avatar image is not uploaded')
   }
   const user = await User.create({
    fullName,
    avatar:avatar.url,
    email,
    coverImage:coverImage?.url || '',
    password,
    username:username.toLowerCase()
   })
   const createUser = await User.findById(user._id).select("-password -refreshToken")
   if(!createUser){
    throw new ApiError(500, 'something went wrong during registration')
   }
   return res.status(200).json(
    new ApiResponse(201, createUser, 'user register successfull')
   )
})



// export const userRegister = asyncHandler( async (req, res) => {
//     // get user details from frontend
//     // validation - not empty
//     // check if user already exists: username, email
//     // check for images, check for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in db
//     // remove password and refresh token field from response
//     // check for user creation
//     // return res


//     const {fullName, email, username, password } = req.body
//     //console.log("email: ", email);

//     if (
//         [fullName, email, username, password].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const existedUser = await User.findOne({
//         $or: [{ username }, { email }]
//     })

//     if (existedUser) {
//         throw new ApiError(409, "User with email or username already exists")
//     }
//     console.log(req.files);

//     const avatarLocalPath = req.files?.avatar[0]?.path;
//     //const coverImageLocalPath = req.files?.coverImage[0]?.path;

//     let coverImageLocalPath;
//     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//         coverImageLocalPath = req.files.coverImage[0].path
//     }
    

//     if (!avatarLocalPath) {
//         throw new ApiError(400, "Avatar file is required")
//     }

//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)

//     if (!avatar) {
//         throw new ApiError(400, "Avatar file is not uploaded")
//     }
   

//     const user = await User.create({
//         fullName,
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         email, 
//         password,
//         username: username.toLowerCase()
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user")
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser, "User registered Successfully")
//     )

// } )

export const userSignin = asyncHandler(async(req, res)=>{
    const{email, password, username} = req.body
    if(!username && !email){
        throw new ApiError(400, 'username or email is required')
    }

    const user = await User.findOne({
        $or:[{username}, {email}]
    })

    if(!user){
        throw new ApiError(400, 'user doesnot exit')
    }

    const valiadPassword = await user.isPasswordCorrect(password)
    if(!valiadPassword){
        throw new ApiError(401, 'Invaliad user credintials')
    }
   const  { jwtToken, refreshToken} =await generateAccessandRefreshToken(user._id)
   console.log(jwtToken, refreshToken);
 const loogedInuser = await User.findById(user._id).select("-password -refreshToken")
 const options ={
    httpOnly:true,
    secure:true
 }
 return res.status(200).cookie("access_token", jwtToken, options).cookie("refresh_token", refreshToken, options).json(new ApiResponse(200, {
    new:loogedInuser, jwtToken, refreshToken
 },
 "user logged In Successfully"
))
})

export const logout = async(req, res) =>{
    const options ={
        httpOnly:true,
        secure:true
     }
  await User.findById(req.user._id, {
    $set:{
        refreshToken:undefined
    },
    

  },{
    new:true
  })
return res.status(200).clearCookie("access_token", options).clearCookie("refresh_token", options)

}