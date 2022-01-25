const mongoose = require("mongoose");
const express = require('express');

require("../schema/exercise.js");
require("../schema/day.js");

const Day = mongoose.model("Day");
const Exercise = mongoose.model("Exercise");

const router = express.Router({mergeParams: true});

router.get("/:exerciseSlug", (req, res) => {
    if(req.user){
        Exercise.findOne({_id: req.query["requiredExercise"]}, (err, requiredExercise) => {
            if(err){
                res.render("error", {});
            } else{
                const requiredIdentifier = requiredExercise["_id"];
                const requiredName = requiredExercise["name"];
                const requiredWeight = requiredExercise["weight"];
                const requiredSets = requiredExercise["sets"];
                const requiredReps = requiredExercise["reps"];

                res.render("exerciseUpdate", {exercise: req.params["exerciseSlug"], id: requiredIdentifier, name: requiredName, weight: requiredWeight, sets: requiredSets, reps: requiredReps});
            }
        });
    } else{
        res.redirect("/");
    }
});

router.post("/:exerciseSlug", (req, res) => {
    Exercise.findOne({_id: req.body["identifier"]}, (err, requiredExercise) => {
        if(err){
            res.render("error", {});
        } else{
            requiredExercise["name"] = req.body["exerciseName"];
            requiredExercise["weight"] = req.body["exerciseWeight"];
            requiredExercise["sets"] = req.body["exerciseSets"];
            requiredExercise["reps"] = req.body["exerciseReps"];
    
            requiredExercise.save();

            const identifierObject = {
                _id: new mongoose.Types.ObjectId(requiredExercise["_id"])
            };
            
            Day.findOne({exercises: identifierObject}, (error, requiredDay) => {
                if(error){
                    res.redirect("/");
                } else{
                    res.redirect("/" + requiredDay["name"]);
                }
            });
        }
    });
});

module.exports = router;