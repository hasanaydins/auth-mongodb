var express = require('express');
var  app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
var LocalStrategy = require('passport-local');
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');

/////////////////////////////////////////////
mongoose.connect(`mongodb://localhost/auth`,{
    useNewUrlParser: true,
}, function(error){console.log(error)});


app.use(require("express-session")({
    secret: "Bu bir session uyglamasıdr",
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.serializeUser(User.deserializeUser ,function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


/////////////////////////////////////////////
app.get("/", function(req, res) {
    res.render("home");
});

/////////////////////////////////////////////
app.get("/kaydol", function(req, res) {
    res.render("kaydol");
});

app.post("/kaydol", function(req, res) {
    User.register(new User({username : req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("home");

        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/gizli");
        });
    });
});

/////////////////////////////////////////////
app.get("/giris", function(req, res) {
    res.render("giris");
});

app.post("/giris", passport.authenticate("local", {
        successRedirect: "/gizli",
        failureRedirect: "/giris"

}), function(req, res) {

});
/////////////////////////////////////////////
app.get("/cikis", function(req, res) {
req.logout();
res.redirect("/");

});

/////////////////////////////////////////////
app.get("/gizli", function(req, res) {
    res.render("gizli");
});





/////////////////////////////////////////////

var server = app.listen(4000,  function() {
    console.log('sunucu portu %d', server.address().port);
});