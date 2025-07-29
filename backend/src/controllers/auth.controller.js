import asyncHandler from '../utils/AsyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js';
import otpStore from '../utils/otpStore.js'
import sendSMS from "../utils/sendSms.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

const sendSignUpOtp = asyncHandler( async(req,res)=>{
    const {phone} = req.body;

    if(!phone || phone.length!==10){
        throw new ApiError(403,"enter valid 10 digit mobile number")
    }

    const existingUser = await User.findOne({phone})
    if(existingUser){
        throw new ApiError(401,"phone number already registered")
    }

    const otp = Math.floor(100000 +Math.random() * 900000).toString()
    const expiry = Date.now()+5*60*1000;

    otpStore.set(phone,{otp,expiry})
    
    console.log("otpStore:", otpStore);
    console.log(`Signup OTP for ${phone}: ${otp}`);

    await sendSMS(phone, otp);
    
    return res.status(200).json(
        new ApiResponse(200,{},"otp sent for signup")
    )
})

const verifyOtpAndRegister = asyncHandler( async(req,res)=>{
    const {phone, otp, password}= req.body

    console.log("otpStore:", otpStore);
    console.log("received phone:", phone);

    const record= otpStore.get(phone)
    if(!record){
        throw new ApiError(404,"no otp sent to this number")
    }

    const { otp:storedOtp, expiry}= record;
    if(Date.now()>expiry){
        otpStore.delete(phone)
        throw new ApiError(403,"otp expired")
    }

    if(storedOtp!== otp){
        throw new ApiError(402,'incorrect otp')
    }

    const hashedPassword= await bcrypt.hash(password,10)
    const user= new User({phone,password:hashedPassword})
    await user.save()
    otpStore.delete(phone)

    const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json(
        new ApiResponse(200, token, 'signup successfully')
    )

})

const sendLoginOtp = asyncHandler( async(req,res)=>{
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if(!user){
        throw new ApiError(404,'user not registered')
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    otpStore.set(phone, { otp, expiry });
    console.log(`Signup OTP for ${phone}: ${otp}`);

    await sendSMS(phone, otp);

    return res.status(200).json(
        new ApiResponse(200,{},"otp sent for login")
    )
})

const verifyOtpAndLogin = asyncHandler(async(req,res)=>{
    const { phone, otp } = req.body;

    const record = otpStore.get(phone);
    if (!record){
        throw new ApiError(404,'no otp found')
    }

    const { otp: storedOtp, expiry } = record;
    if (Date.now() > expiry) {
    otpStore.delete(phone);
    throw new ApiError(402,'otp expired')}

    if(storedOtp !== otp){
        throw new ApiError(403,'invalid otp')
    }

    otpStore.delete(phone);

    const user = await User.findOne({phone
    })
    const {refreshToken,accessToken}=await generateAccessAndRefereshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
})

const generateAccessAndRefereshTokens = async (userId)=>{
    try{
        const user = await User.findById(userId)
console.log("user instance:", user)
console.log("has generateAccessToken:", typeof user.generateAccessToken)
console.log("has generateRefreshToken:", typeof user.generateRefreshToken)


        const accessToken =user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave :false})
        return{accessToken , refreshToken}
    }
    catch(error){
        throw new ApiError(500,"something went wrong while generating referesh and access token")
    }
}

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{}, "user logged out"))



})

export {
    sendLoginOtp,
    sendSignUpOtp,
    verifyOtpAndRegister,
    verifyOtpAndLogin,generateAccessAndRefereshTokens,logoutUser
}
