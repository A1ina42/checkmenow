const mongoose = require("mongoose");

//* Схема категории вопроса
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 1,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categorySchema);
