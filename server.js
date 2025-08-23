import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import categoryRouter from './routes/categoryRoute.js'

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


// 404 handler (for unmatched routes)

/*
app.all('*',(req,res,next)=>{
    const err = new Error(`Cannot got to this route ${req.originalUrl}`);
    next(err);
});

* */
app.use((req, res, next) => {
    const err = new Error(`Cannot go to this route ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
});


app.use((err,req,res,next)=>{
    res.status(err.statusCode || 500).json({message: err.message || 'Internal Server Error',});
});

app.listen(PORT, ()=>{
    console.log(`Server listening to port ${PORT}`);
});