// Middleware

var middleware = [];

middleware.isLoggedIn = function (req, res, next){
	if (req.isAuthenticated()) {
		return next();
	} else{
		if (req.url === "/addNewComment") {
			req.flash("url", req.params.id+"/comments/"+req.url)
			req.flash("url2", req.params.id+"/comments/"+req.url)
			res.redirect("/LoginPage")
		} else if ((req.url === "/NewPost") || (req.url == req.params.id)) {
			req.flash("url", req.url)
			req.flash("url2", req.url)
			res.redirect("/LoginPage")
		} else{
			res.redirect("/LoginPage")
		}
	}
}
middleware.isThisYourPost = function (req, res, next){
	if (req.isAuthenticated()) {
		Post.findById(req.params.id, function(err, foundPost){
			if (foundPost.author.id.equals(req.user._id)) {
				next();
			} else{
				req.flash("error","You don't have permission to do that");
				res.redirect("/IndexPage/"+req.params.id);
			}
		})
	} else{
		req.flash("error", "You don't have permission to do that!");
		res.redirect("/IndexPage/"+req.params.id);
	}
}
middleware.isThisYourComment = function(req, res, next){
	if (req.isAuthenticated()) {
		Comment.findById(req.params.commentId, function(err, foundComment){
			if (foundComment.author.id.equals(req.user._id)) {
				next();
			} else{
				req.flash("error", "You don't have permission to do that!");
				res.redirect("/IndexPage/"+req.params.id);
			}
		})
	} else{
		req.flash("error", "You don't have permission to do that!");
		res.redirect("/IndexPage/"+req.params.id);
	}
}

middleware.noti = function(req, res, next){
	req.flash("success", "hello");
}

module.exports = middleware;

