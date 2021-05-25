const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
    name: {type: String, required: true},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    exercises: [{exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercises"
    }}]
});

mongoose.model("Day", DaySchema);