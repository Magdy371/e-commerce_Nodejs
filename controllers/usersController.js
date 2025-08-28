import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';

export const getUsers =asyncHandler(
    async(req, res,next)=>{
        if(req.user.role!=='admin'){
            return next(new ApiError('Forbidden: Only admin can view all users', 403));
        }
        const allUsers = await userModel.find();
        return res.status(200).json({count:allUsers.length, users:allUsers});
    }
);

export const getUserById = asyncHandler(
    async(req, res, next)=>{
        const { id } = req.params;
        if(req.user.role!=='admin'&&req.user.id !==id){
            return next(new ApiError('Forbidden: You can only view your own info', 403));
        }
        const foundedUser = await userModel.findById(id);
        if(!foundedUser){
            return next(new ApiError('Not_found: User not found',404));
        }
        return res.status(200).json({user:foundedUser});
    }
);

export const updateUser = asyncHandler(
    async (req, res, next)=>{
        const { id } = req.params;
        if(req.user.role!=='admin'&& req.user.id!==id){
            return next(new ApiError('Forbidden: You can only update your own info', 403));
        }
        const { name, age, email, password, role, phone, address, profileImage } = req.body;
        let user = await userModel.findById(id);
        if (!user) {
            return next(new ApiError('Not_found: User not found', 404));
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        // Update other fields
        user.name = name || user.name;
        user.age = age || user.age;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.profileImage = profileImage || user.profileImage;

        user = await user.save();
        //202 ====> the update is accepted
        return res.status(202).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                age: user.age,
                profileImage: user.profileImage
            }
        });
    }
);



export const deleteUser = asyncHandler(
    async (req,res,next)=>{
        const { id } = req.params;
        if(req.user.role!=='admin'&& req.user.id!==id){
            return next(new ApiError('Forbidden: You can only delete your own info', 403));
        }
        const user = await userModel.findByIdAndDelete(id);
        if(!user){
            return next(new ApiError('Not-Found: user cannot be found',404));
        }
        return res.status(204).send();
    }
);