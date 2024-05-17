import User from "../models/User.Model.js"
import { ApiError } from "../utils/apiError.js"
import jwt from 'jsonwebtoken'

export const verifyUser = async(req, res, next) =>{
   try {
    const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer", "")

    if(!token){
     throw ApiError(401, 'unathuorized request')
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
     throw new ApiError(401, "Invalid Access Token")
    }
    
    req.user = user;
    next()
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
   }
}