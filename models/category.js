import mongoose from 'mongoose';
const {Schema} = mongoose;
const categorySchema = new Schema({
    name:{
        type:String,
        required:[true,'The Category ame is essential'],
        unique:[true,'The category name is already in use'],
        minLength:[3,'The Categry name is too short'],
        maxLength:[32,'The category name is too long'],
        trim:true,
        match: [/^[a-zA-Z0-9 &-]+$/, 'Category name contains invalid characters']
    },
    //A and B =>Shppong.com/a-and-b
        slug: {
            type: String
        }
        ,
    image:String,
},{
    timestamps:true
    }
);
const categoryModel = mongoose.model('Category',categorySchema);
export default categoryModel;