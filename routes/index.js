
var express = require("express"),
	router 	= express.Router(),
	Post = require("../models/post"),
	middleware = require("../middleware"),
	passport = require("passport");
	User = require("../models/user");

router.get("/", function(req, res){
	res.render("LandingPage", {title: "EVC Tutor Exchange"});
});



router.get("/AboutPage", function (req, res) {
	res.render("AboutPage", {title: "AboutPage"})
})


// Authenticate Route
router.get("/RegisterPage", function (req, res) {
	req.session.url = req.url;
	console.log(req.url)
	res.render("RegisterPage", {title: "RegisterPage"})
})
router.post("/RegisterPage", function (req, res) {
	var newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err);
			return res.render("RegisterPage");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/IndexPage");
		});
	});
});

router.get("/LoginPage", function (req, res) {
	res.render("LoginPage", {title: "LoginPage"})
})

router.post("/LoginPage",passport.authenticate("local",
	{
		failureRedirect: "/LoginPage"
	}) ,function(req, res){
			if ((req.flash("url2"))[0]) {
				res.redirect("/IndexPage/"+(req.flash("url"))[0]);
			} else{
				res.redirect("/IndexPage")
			}

})

router.get("/LogOut", function (req, res) {
	req.logout();
	req.flash("success", "You are logged out!");
	res.redirect("/IndexPage");
})


module.exports = router;
