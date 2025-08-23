import mongoose from 'mongoose';

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('db successfully connected');
};

export default connectDB;
