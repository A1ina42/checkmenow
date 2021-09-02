//* Импорт модулей
const mongoose = require("mongoose");

//* Схема теста
const testbankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        trim: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    isOpen: {
        type: Boolean,
        required: true,
        default: false
    },
    resultAfterTesting: {
        type: String,
        required: true,
        enum: ['dontShow', 'show', 'showAnswers']
    },
    link: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Testbank", testbankSchema);
