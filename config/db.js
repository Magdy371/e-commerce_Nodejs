import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('db successfully connected');
    }catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
export default connectDB;