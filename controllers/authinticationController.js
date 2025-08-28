import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';

export const registerUser = asyncHandler(
    async (req,res,next)=>{
        const { name, age, email, password, role, phone, address } = req.body;
        if(!name || !email||!password||!phone){
            return next(new ApiError('Bad_request: Name, email, password and phone are required',400));
        }
        const existingUser = await userModel.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return next(new ApiError('Conflict: Email or phone already in use', 409));
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt);
        const user = await userModel.create({ name, age, email, password: passwordHash, role, phone, address  });
        const token = jwt.sign({sub:user._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_IN || '24h'
        });
        return res.status(201).json({
            token,
            user:{
                id:user._id,
                email:user.email,
                name:user.name,
                role:user.role,
                phone:user.phone,
                address:user.address,
                age:user.age,
                password:user.password
            }
        });
    }
);

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

