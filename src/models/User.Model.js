import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
     username:{  
        type:String,
        required:true,
        unoque:true,
        lowercase: true,
        trim:true,
        index:true         
        },
     email:{  
         type:String,
         required:true,
         unoque:true,
         lowercase: true,
         trim:true,        
            },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    coverImage:{
        type:String,

    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],

    password:{
        type:String,
        required:[true, 'password is required']
    }, 
    refreshToken:{
        type:String,
    }
  


}, {timestamps:true})

userSchema.pre('save', async(next)=>{
    if(!this.isModified('password')) return next()
this.password = bcrypt.hash(this.password, 10)
next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateJWTToken = function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullName
       }, process.env.JWT_SECRET ,{ expiresIn:process.env.JWT_TOKEN_EXPIRY}) 
}
userSchema.methods.generateRefreshToken = function(){
   jwt.sign({
    _id:this._id,

   }, process.env.REFRESH_TOKEN ,{ expiresIn:process.env.REFRESH_TOKEN_EXPIRY}) 
}
const User = mongoose.model('User', userSchema)

export default User