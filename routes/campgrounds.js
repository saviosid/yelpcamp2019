const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware"); //loads index.js by default if no filename
// * Campground Routes

// Index Route
router.get("/campgrounds", (req, res) => {
    //* get Campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log("Error Retreiving Data");
        } else {
            res.render("./campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});

// Create Route .. alled from '/campgrounds/new' form as per REST to create new campground

router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const author = {
        id: req.user.id,
        username: req.user.username
    };
    const newCampground = {
        name: name,
        image: image,
        description: description,
        price: price,
        author: author
    };
    Campground.create(newCampground, (err, newlyAdded) => {
        if (err) {
            console.log("Error");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//  form to create a new campground as per REST

router.get("/campgrounds/new", middleware.isLoggedIn, (req, res) => {
    res.render("./campgrounds/new");
});

// Show Route
router.get("/campgrounds/:id", (req, res) => {
    // retreive campground from DB
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCampground) => {
            if (err) {
                console.log("Error");
            } else {
                res.render("./campgrounds/show", {
                    campground: foundCampground
                });
            }
        });
});

// Edit Route
router.get(
    "/campgrounds/:id/edit",
    middleware.checkCampgroundOwnership,
    (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect("campgrounds");
            } else {
                res.render("./campgrounds/edit", {
                    campground: foundCampground
                });
            }
        });
    }
);

// Update Route
router.put(
    "/campgrounds/:id",
    middleware.checkCampgroundOwnership,
    (req, res) => {
        Campground.findByIdAndUpdate(
            req.params.id,
            req.body.campground,
            (err, updatedCampground) => {
                if (err) {
                    res.redirect("/campgrounds");
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        );
    }
);

router.delete(
    "/campgrounds/:id",
    middleware.checkCampgroundOwnership,
    (req, res) => {
        Campground.findByIdAndRemove(req.params.id, err => {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds");
            }
        });
    }
);

module.exports = router;
