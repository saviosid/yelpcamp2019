const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware"); // defaults to index.js if no filename

// Comment Routes
router.get(
    "/campgrounds/:id/comments/new",
    middleware.isLoggedIn,
    (req, res) => {
        // retreive campground from DB
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log("Error");
            } else {
                res.render("./comments/new", {
                    campground: foundCampground
                });
            }
        });
    }
);

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, (req, res) => {
    // retreive campground from DB
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, newComment) => {
                if (err) {
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    campground.comments.push(newComment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comments Edit Route
router.get(
    "/campgrounds/:id/comments/:comment_id/edit",
    middleware.checkCommentOwnership,
    (req, res) => {
        // retreive campground from DB
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                res.render("./comments/edit", {
                    campground_id: req.params.id,
                    comment: foundComment
                });
            }
        });
    }
);

//Comment Update  Route
router.put(
    "/campgrounds/:id/comments/:comment_id",
    middleware.checkCommentOwnership,
    (req, res) => {
        Comment.findByIdAndUpdate(
            req.params.comment_id,
            req.body.comment,
            (err, foundComment) => {
                if (err) {
                    res.redirect("back");
                } else {
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        );
    }
);

// Delete Route
router.delete(
    "/campgrounds/:id/comments/:comment_id",
    middleware.checkCommentOwnership,
    (req, res) => {
        Comment.findByIdAndRemove(req.params.comment_id, err => {
            if (err) {
                res.redirect("back");
            } else {
                req.flash("success", "Comment Successfully deleted");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    }
);

module.exports = router;
