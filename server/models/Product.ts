import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    Bill_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
        required: true,

    },
    quantity: {
        type: Number,
        required: true,
    }
    
});

export default mongoose.model('Product', productSchema);