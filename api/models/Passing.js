const mongoose = require("mongoose");

//* Схема прохождения теста
const passingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    testbank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Testbank'
    },
    startedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    endedAt: {
        type: Date,
        default: null,
    },
    isEnded: {
        type: Boolean,
        default: false,
        required: true
    },
    qna: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        answers: [{
            userText: {
                type: String,
                trim: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }]
    }],
    resultPercent: {
        type: Number,
        default: null
    },
    countWrongAnswers: {
        type: Number,
        default: null
    },
    answersCount: {
        type: Number,
        default: null
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

module.exports = mongoose.model("Passing", passingSchema);
