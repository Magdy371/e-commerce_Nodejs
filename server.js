import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import categoryRouter from './routes/categoryRoute.js'
import ApiError from './utils/ApiError.js';

dotenv.config();
connectDB();

const app = express();

//Middle were always before route
app.use(express.json());
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
    console.log(`the application mode is ${process.env.NODE_ENV}`);
}



const PORT = process.env["PORT"] || 5000;
app.use('/api/category',categoryRouter);


app.use((req, res, next) => {
    next(new ApiError(`Cannot go to this route ${req.originalUrl}`, 404));
});



// Global error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message || "Internal Server Error",
    });
});

app.listen(PORT, ()=>{
    console.log(`Server listening to port ${PORT}`);
});