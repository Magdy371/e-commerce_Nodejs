import categoryModel from '../models/category.js'
import slugify from 'slugify';

export const createCategory = async (req,res)=>{
    const {name} = req.body;
    try{
        if(!name){
            res.status(400).json({message:'Category name required'});
        }
        const exist = await categoryModel.findOne({name});
        if(exist){
            return res.status(409).json({message:'Category name is already in use'});
        }
        const category = await categoryModel.create({name, slug:slugify(name)});
        return res.status(201).json({category})
    }catch (e) {
        return res.status(500).json({e});
    }
};


export const getCategories = async(req,res)=>{
    //const page = req.query.page * 1 || 1;
    //const limit = 4;
    //const skip=(page-1)*limit;
    const categories = await categoryModel.find();//.skip(skip).limit(limit);
    //const name = categories.map(categories=>categories.name);
    return res.status(200).json({results:categories.length,data:categories});
};



export const findByName = async (req, res) => {
    const { name } = req.params;
    try {
        const found_Category = await categoryModel.findOne({ name });
        if (!found_Category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json({ found_Category });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const findBy_Id = async (req, res) => {
    const { id } = req.params;

    try {
        const categoryFound = await categoryModel.findById(id);

        if (!categoryFound) {
            return res.status(404).json({ message: 'The specified category ID was not found' });
        }

        return res.status(200).json({ categoryFound });
    } catch (e) {
        res.status(500).json({e});
    }
};


export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const category = await categoryModel.findByIdAndUpdate(
            id,
            {name, slug:slugify(name)},
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ category });
    } catch (e) {
        res.status(500).json({e });
    }
};

export const deleteCategory = async(req, res)=>{
    const {id} = req.params;
    try{
        const foundedName = await categoryModel.findById(id);
        if(!foundedName){
            return res.status(404).json({message:'Category not found'});
        }
        const deletedCategory = await categoryModel.deleteOne({_id:id});
        return res.status(204).json({message:`${deletedCategory} is deleted`});
    }catch (e) {
        return res.status(500).json({message:`server error ${e.message}`});
    }
}