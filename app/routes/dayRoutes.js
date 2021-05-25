const mongoose = require("mongoose");
const express = require('express');

require("../schema/exercise.js");
require("../schema/day.js");

const Day = mongoose.model("Day");
const Exercise = mongoose.model("Exercise");

const router = express.Router({mergeParams: true});

const daysList = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

router.get("/:daySlug", (req, res) => {
    if(req.user && daysList.indexOf(req.params["daySlug"]) > -1){        
        Day.findOne({name: req.params.daySlug, user: req.user["_id"]}, (err, relevantDay) => {
            if(err){
                console.log("AN ERROR OCCURRED");

                res.render("error", {});
            }else{
                Exercise.find({_id: relevantDay["exercises"]}, (error, requiredExercises) => {
                    if(error){
                        console.log("AN ERROR OCCURRED");
        
                        res.redirect("/");
                    } else{
                        res.render("selectedDay", {day: req.params["daySlug"], exercisesList: requiredExercises});
                    }
                });
            }
        });
    } else if(!req.user && daysList.indexOf(req.params["daySlug"]) > -1){
        res.redirect("/login");
    } else{
        res.render("error", {});
    }
});

router.post("/:daySlug", (req, res) => {
    Exercise.remove({_id: req.body["deletedExercise"]}, (err) => {
        if (err) {
            res.render("error", {});
        } else{
            res.redirect(req.params["daySlug"]);
        }
    });
});

module.exports = router;