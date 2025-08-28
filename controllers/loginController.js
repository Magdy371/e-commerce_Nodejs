import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';

export const logninUser = asyncHandler(
    async (req,res,next)=>{
        const {email, password} = req.body;
        const foundedEmail = await userModel.findOne({email});
        if(!foundedEmail){
            next(new ApiError('your email cannot be found',404));
        }
       const isPasswordValid = await bcrypt.compare(password,foundedEmail.password);
        if(!isPasswordValid){
            return next(new ApiError("authorization failed: invalid password check", 401));
        }
        const foundedRole = foundedEmail.role;
        return res.status(200).json({'message':'Logged in successfully',
        role:foundedRole});
    }
);