const mongoose = require("mongoose");
const express = require('express');

require("../schema/exercise.js");
require("../schema/day.js");

const Day = mongoose.model("Day");
const Exercise = mongoose.model("Exercise");

const router = express.Router({mergeParams: true});

const daysList = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

router.get("/add", (req, res) => {
    if(req.user && daysList.indexOf(req.params["daySlug"]) > -1){
        res.render("exerciseAdd", {day: req.params["daySlug"]});
    } else if(req.user && daysList.indexOf(req.params["daySlug"]) === -1){
        res.render("error", {});
    } else{
        res.redirect("/login");
    }
});

router.post("/add", (req, res) => {
    const newExercise = new Exercise({
        name: req.body.exerciseName,
        weight: req.body.exerciseWeight,
        sets: req.body.exerciseSets,
        reps: req.body.exerciseReps
    });

    newExercise.save((error, exerciseModel) => {
        if(error){
            console.log("AN ERROR OCCURRED");

            res.render("error", {});
        } else{
            Day.findOne({name: req.params.daySlug, user: req.user["_id"]}, (err, requiredDay) => {
                if(err){
                    console.log("AN ERROR OCCURRED");

                    res.redirect("/");
                } else{
                    requiredDay["exercises"].push(exerciseModel["_id"]);

                    requiredDay.markModified();

                    requiredDay.save();

                    res.redirect("/" + req.params["daySlug"]);
                }
            });

        }
    });
});

module.exports = router;