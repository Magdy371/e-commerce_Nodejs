import mongoose from 'mongoose';
const {Schema} = mongoose;

const userSchema = new Schema({
        name: {
            type: String,
            required: [true, 'The User name is essential'],
            minLength: [3, 'The User name is too short'],
            maxLength: [32, 'The User name is too long'],
            trim: true,
            match: [/^[a-zA-Z0-9 &-]+$/, 'User name contains invalid characters']
        },
        age: {
            type: Number,
            min: [18, 'Age cannot be negative'],
            max: [120, 'Age seems invalid']
        },
        email: {
            type: String,
            required: [true, 'The email is essential'],
            unique: [true, 'The email is already in use'],
            trim: true,
            lowercase: true,
            match: [/^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@gmail\.com$/, 'Email address is invalid']
        },
        password: {
            type: String,
            required: true,
            minLength: [6, 'The password is too short'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        phone: {
            type: String,
            match: [/^01[0125][0-9]{8}$/, 'Phone number is invalid'],
            required: [true, 'The phone number is essential'],
            trim: true,
            unique: true ,
            maxLength: [11, 'Phone number is too long'],
            minLength: [11, 'Phone number is too short'],
        },
        address: {
            type: String,
            maxLength: [200, 'The address is too long'],
            trim: true,
        },
        profileImage: String,

    }, {
        timestamps: true
    }
);
const userModel = mongoose.model('User', userSchema);
export default userModel;