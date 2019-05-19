const Campground = require("../models/campground");
const Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "you need to be logged in to do that");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                // does user own comment
                if (foundComment.author.id.equals(req.user.id)) {
                    return next();
                } else {
                    req.flash("error", "you do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect("back");
            } else {
                // does user own campground
                if (foundCampground.author.id.equals(req.user.id)) {
                    return next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "you need to be logged in to do that");
        res.redirect("back");
    }
};
module.exports = middlewareObj;
