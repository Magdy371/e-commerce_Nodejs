import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/db.js';
import categoryRouter from './routes/categoryRoute.js'
import ApiError from './utils/ApiError.js';
import globalErroHandler from './middlewares/errorHandling.js'


dotenv.config();

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server listening to port ${PORT}`);
    });
}).catch((err)=>{
    console.error("DB connection failed", err);
    process.exit(1);
});

const app = express();

//Security middleware
app.use(helmet());

//Enable cors
app.use(cors());

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


// Global error handler middleware
app.use(globalErroHandler);
