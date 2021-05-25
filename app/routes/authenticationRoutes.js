const mongoose = require("mongoose");
const express = require('express');
const passport= require("passport");

require("../schema/day.js");
require("../schema/user.js");

const User = mongoose.model("User");
const Day = mongoose.model("Day");

const router = express.Router({mergeParams: true});

router.get("/register", (req, res) => {
    if(req.user){
        res.redirect("/");
    } else{
        res.render("registration", {error: req.flash("error")});
    }}
);

router.post("/register", (req, res) => {
    if(!req.user){
        const registeredUser = new User({
            username: req.body.username,
            email: req.body.email
        });

        const mondayDocument = new Day({
            name: "monday",
        });
        
        const tuesdayDocument = new Day({
            name: "tuesday",
        });

        const wednesdayDocument = new Day({
            name: "wednesday",
        });

        
        const thursdayDocument = new Day({
            name: "thursday",
        });
        
        const fridayDocument = new Day({
            name: "friday",
        });
        
        const saturdayDocument = new Day({
            name: "saturday",
        });
        
        const sundayDocument = new Day({
            name: "sunday",
        });

        const documentsArray = [mondayDocument, tuesdayDocument, wednesdayDocument, thursdayDocument, fridayDocument, saturdayDocument, sundayDocument];

        documentsArray.forEach((document) => document.save());

        const identifiersArray = documentsArray.map((document) => document["_id"]);

        registeredUser["exerciseDays"].push.apply(registeredUser["exerciseDays"], identifiersArray);

        User.register(registeredUser, req.body.password, function(err, user){
            if(err){
                const errorMessage = "TRY AGAIN!";

                req.flash("error", errorMessage);

                res.redirect("/register");
            } else{
                passport.authenticate("local")(req, res, function(){
                    documentsArray.forEach((document) => {
                        document["user"] = user["_id"];

                        document.save();
                    });

                    res.redirect("/"); 
                });
            }
        });
    } else{
        res.redirect("/");
    }
});

router.get("/login", (req, res) => {
    if(req.user){
        res.redirect("/");
    } else{
        res.render("login", {error: req.flash("error")});
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate('local', function(err,user) {
        if(user){
            req.logIn(user, () => res.redirect('/'));
        } else{
            const errorMessage = "TRY AGAIN!";

            req.flash("error", errorMessage);

            res.redirect("/login");
        }
    })(req, res, next);
});

router.get("/logout", function(req, res){
    if(req.user){
        req.logout();

        res.redirect("/");
    } else{
        res.render("error", {});
    }
});

module.exports = router;