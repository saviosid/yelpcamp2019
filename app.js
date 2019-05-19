const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment.js"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    seedDB = require("./seeds");

const commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelpcamp", {
    useNewUrlParser: true
});
/*mongoose.connect(
    "mongodb://default:default1234@ds137003.mlab.com:37003/saviosdb"
); // MLab URK */

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(flash());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// Passport Config
app.use(
    require("express-session")({
        secret: "the encoding string",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Populate DB thru seedDB
//seedDB();
// Setup Middleware to pass currentUser to all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//  use imported routes files
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

const port = process.env.PORT || 3000;
let ip = process.env.IP || "127.0.0.1";

app.listen(port, ip, () =>
    console.log(`Yelpcamp Server started on port ${port} ip ${ip}`)
);
