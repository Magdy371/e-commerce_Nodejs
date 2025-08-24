import categoryModel from '../models/category.js'
import slugify from 'slugify';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';


export const createCategory = asyncHandler(
    async (req,res,next)=>{
        const {name} = req.body;
        if (!name) {
            //400 is a bad request
            return next(new ApiError('Category name required', 400));
        }
        const exist = await categoryModel.findOne({name});
        if(exist){
            //return res.status(409).json({message:'Category name is already in use'});
            return next(new ApiError('Category name is already in use',409));
        }
        const category = await categoryModel.create({name, slug:slugify(name)});
        return res.status(201).json({category})
    }
);


export const getCategories = asyncHandler(async(req,res)=>{
    const categories = await categoryModel.find();
    return res.status(200).json({results:categories.length,data:categories});
});



export const findByName = asyncHandler(
    async (req, res,next) => {
            const { name } = req.params;
            const found_Category = await categoryModel.findOne({ name });
            if (!found_Category) {
                //return res.status(404).json({message: 'Category not found'});
                return next(new ApiError('Specified Category name not found',404));
            }
            return res.status(200).json({found_Category});
    });


export const findBy_Id = asyncHandler(
    async (req, res,next) => {
        const { id } = req.params;
        const categoryFound = await categoryModel.findById(id);

        if (!categoryFound) {
            //return res.status(404).json({ message: 'The specified category ID was not found' });
            return next(new ApiError('The specified category ID was not found',404));
        }

        return res.status(200).json({ categoryFound });
    }
);


export const updateCategory = asyncHandler(
    async (req, res,next) => {
        const { id } = req.params;
        const { name } = req.body;

            const category = await categoryModel.findByIdAndUpdate(
                id,
                {name, slug:slugify(name)},
                { new: true, runValidators: true }
            );
            if (!category) {
                next(new ApiError('Category not found',404))
            }
            return res.status(200).json({ category });
    }
);

export const deleteCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        const deletedCategory = await categoryModel.findByIdAndDelete(id);
        if (!deletedCategory) {
            return next(new ApiError('Category not available any more', 404));
        }
        return res.status(200).json({
            message: 'Category deleted successfully',
            data: deletedCategory
        });
    }
);