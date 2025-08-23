const globalErroHandler = (err, req, res,next) => {
    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        error:err,
        message: err.message || "Internal Server Error",
        stack: err.stack,
    });
};
export default globalErroHandler;