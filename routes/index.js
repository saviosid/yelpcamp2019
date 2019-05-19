const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// for all-purpose routes

router.get("/", (req, res) => {
    res.render("landing");
});

// Auth Routes

// show Register Form
router.get("/register", (req, res) => {
    res.render("./user/register");
});

// Handle Registration
router.post("/register", (req, res) => {
    // create a user with username and the register created user with password
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Yelpcamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show Login Form
router.get("/login", (req, res) => {
    res.render("./user/login");
});

// Handle Login
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {}
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "you are logged out");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
