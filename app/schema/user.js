const mongoose = require('mongoose');

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    exerciseDays: [{day: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Day"
    }}]
});

UserSchema.plugin(passportLocalMongoose);

mongoose.model("User", UserSchema);