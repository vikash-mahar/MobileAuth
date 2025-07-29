import mongoose, {Schema} from 'mongoose'
import bcrypt from "bcryptjs"; // or 'bcrypt' if you're using it
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },

    refreshToken:{
        type:String
    }

},{timestamps:true})

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        phone: this.phone,
    },
        process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}



export const User = mongoose.model("User",userSchema)