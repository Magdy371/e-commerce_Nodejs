import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/Users.js';
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

export const getUsers =asyncHandler(
    async(req, res,next)=>{
        const allUsers = await userModel.find();
        return res.status(200).json({count:allUsers.length, users:allUsers});
    }
);

export const getUserById = asyncHandler(
    async(req, res, next)=>{
        const { id } = req.params;
        const foundedUser = await userModer.findById(id);
        if(!foundedUser){
            return next(new ApiError('Not_found: User not found',404));
        }
        return res.status(200).json({user:foundedUser});
    }
);

export const updateUser = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;

        const {
            name, age, email, password, role, phone, address} = req.body || {};

        if (!req.body || !Object.keys(req.body).length) {
            return next(new ApiError('Bad_request: Request update cannot be empty', 400));
        }

        // Uniqueness check only if email or phone is provided
        if (email || phone) {
            const conflictUser = await userModel.findOne({
                $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
                _id: { $ne: id }
            });
            if (conflictUser) {
                return next(new ApiError('Conflict: Email or phone already in use', 409));
            }
        }

        // Build updated fields object only with provided fields
        let updatedFields = {};
        if (name !== undefined) updatedFields.name = name;
        if (age !== undefined) updatedFields.age = age;
        if (email !== undefined) updatedFields.email = email;
        if (role !== undefined) updatedFields.role = role;
        if (phone !== undefined) updatedFields.phone = phone;
        if (address !== undefined) updatedFields.address = address;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        const user = await userModel.findByIdAndUpdate(id, updatedFields, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return next(new ApiError('Not-Found: user cannot be found', 404));
        }

        // Do not expose password in response
        const { password: _, ...userData } = user.toObject();
        return res.status(200).json({ user: userData });
    }
);



export const deleteUser = asyncHandler(
    async (req,res,next)=>{
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if(!user){
            return next(new ApiError('Not-Found: user cannot be found',404));
        }
        return res.status(204).send();
    }
);