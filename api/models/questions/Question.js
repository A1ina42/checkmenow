const mongoose = require("mongoose");

//* Схема вопроса (множественный ответ, одиночный ответ, свободный ответ)
const questionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
            min: 1,
            trim: true
        },
        answers: [{
            text: {
                type: String,
                required: true,
                min: 1,
                trim: true,
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }],
        type: {
            type: String,
            required: true,
            enum: ['cb', 'rb', 'free']
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
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

module.exports = mongoose.model("Question", questionSchema);