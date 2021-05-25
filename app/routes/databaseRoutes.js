const express = require('express');

const router = express.Router({mergeParams: true});

// router.get("/data/exercises", (req, res) => {
//     if(req.user){
//         res.render("database", {});
//     } else{
//         res.redirect("/");
//     }
// });

router.get("/exercises", (req, res) => {
    res.render("database", {});
});

module.exports = router;