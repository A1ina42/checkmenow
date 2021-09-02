const mongoose = require("mongoose");

//* Схема группы
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
        min: 2,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    testbanks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Testbank'
    }],
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        isAccepted: {
            type: Boolean,
            required: true,
            default: false
        }
    }],
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

module.exports = mongoose.model("Group", groupSchema);
