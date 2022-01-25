const mongoose = require('mongoose');

const URLSlugs = require('mongoose-url-slugs');

const ExerciseSchema = new mongoose.Schema({
    name: {type: String, required: true},
    weight: {type: Number, required: true},
    sets: {type: Number, required: true},
    reps: {type: Number, required: true},
});

ExerciseSchema.plugin(URLSlugs("_id"), {update: true});

mongoose.model("Exercise", ExerciseSchema);