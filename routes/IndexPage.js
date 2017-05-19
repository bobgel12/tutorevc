// ===========
// Index Route
// ===========
var express = require("express"),
	router 	= express.Router(),
	Post 	= require("../models/post"),
	middleware = require("../middleware")		
	session = require("express-session");


router.get("/", function (req, res) {
	Post.find({}, function(err, posts){
		if (err) {
			console.log(err);
		} else{
			Post.count({}, function(err, count){
				if (err) {
					console.log(err);
				} else if (req.user) {
    				console.log( "Number of posts: ", count );
    				// console.log(req.user);
    				if ((req.user.trackingPost < count)) {
    					var different = count - req.user.trackingPost;
    					var display = "We have " + String(different) + " new post for you!";
	    				req.user.trackingPost = count;
	    				req.user.save();
	    				console.log("We have " + different + " new post for you!");
	    				// console.log(req.flash("hello"));
	    				req.flash("success", display);
						res.render("IndexPage", {title: "IndexPage", posts: posts, currentUser: req.user, success: req.flash(display)});
    				} else if ((req.user.trackingPost > count)) {
    					req.user.trackingPost = count;
	    				req.user.save();
						res.render("IndexPage", {title: "IndexPage", posts: posts, currentUser: req.user});
    				} else {
						res.render("IndexPage", {title: "IndexPage", posts: posts, currentUser: req.user});
					}
    			} else {
					res.render("IndexPage", {title: "IndexPage", posts: posts, currentUser: req.user});
    			}
			});
		}
	});
});

router.post("/", middleware.isLoggedIn, function (req, res) {
	Post.create(req.body.post, function (err, post) {
		if (err) {
			console.log(err);
		}
		else{
			post.author.id = req.user._id;
			post.author.username = req.user.username;
			post.save();
			res.redirect("/IndexPage");
		}
	});
});

router.get("/NewPost", middleware.isLoggedIn, function(req, res){
	res.render("NewPost", {title: "New Post"});
});

router.get("/:id", function (req, res) {
	Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
		if (err) {
			console.log(err);
		} else{
			res.render("ShowPage", {title: "Show Page",foundPost: foundPost});
			console.log(req.url);
		}
	});
});


// UPDATE ROUTE
router.get("/:id/edit", middleware.isThisYourPost,  function(req, res){
	Post.findById(req.params.id, function(err, foundPost){
		if (err) {
			console.log(err)
		} else{
			res.render("EditPage", {title: "Edit Page", foundPost: foundPost});

		}
	});
});

router.put("/:id", middleware.isThisYourPost, function  (req, res) {
	Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, updatedPost) {
		if (err) {
			console.log(err);
			req.flash("error", "There is a problem when you try to update the form")
			res.redirect("/IndexPage");
		} else{
			// console.log(req.get("referrer"));
			req.flash("success", "Your post has been editted!")
			res.redirect("/IndexPage/"+ req.params.id);
		}
	});
});

// DESTROY ROUTE

router.delete("/:id", middleware.isThisYourPost, function (req, res) {
	Post.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			console.log(err);
		} else{
			req.flash("success", "Your post has been deleted!")
			res.redirect("/IndexPage")
		}
	});
});


module.exports = router;
