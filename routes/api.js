var express = require('express');
2	var router = express.Router();
3	var mongoose = require( 'mongoose' );
4	var Post = mongoose.model('Post');
5	//Used for routes that must be authenticated.
6	function isAuthenticated (req, res, next) {
7		// if user is authenticated in the session, call the next() to call the next request handler 
8		// Passport adds this method to request object. A middleware is allowed to add properties to
9		// request and response objects
10	
11		//allow all get request methods
12		if(req.method === "GET"){
13			return next();
14		}
15		if (req.isAuthenticated()){
16			return next();
17		}
18	
19		// if the user is not authenticated then redirect him to the login page
20		return res.redirect('/#login');
21	};
22	
23	//Register the authentication middleware
24	router.use('/posts', isAuthenticated);
25	
26	router.route('/posts')
27		//creates a new post
28		.post(function(req, res){
29	
30			var post = new Post();
31			post.text = req.body.text;
32			post.created_by = req.body.created_by;
33			post.save(function(err, post) {
34				if (err){
35					return res.send(500, err);
36				}
37				return res.json(post);
38			});
39		})
40		//gets all posts
41		.get(function(req, res){
42			console.log('debug1');
43			Post.find(function(err, posts){
44				console.log('debug2');
45				if(err){
46					return res.send(500, err);
47				}
48				return res.send(200,posts);
49			});
50		});
51	
52	//post-specific commands. likely won't be used
53	router.route('/posts/:id')
54		//gets specified post
55		.get(function(req, res){
56			Post.findById(req.params.id, function(err, post){
57				if(err)
58					res.send(err);
59				res.json(post);
60			});
61		}) 
62		//updates specified post
63		.put(function(req, res){
64			Post.findById(req.params.id, function(err, post){
65				if(err)
66					res.send(err);
67	
68				post.created_by = req.body.created_by;
69				post.text = req.body.text;
70	
71				post.save(function(err, post){
72					if(err)
73						res.send(err);
74	
75					res.json(post);
76				});
77			});
78		})
79		//deletes the post
80		.delete(function(req, res) {
81			Post.remove({
82				_id: req.params.id
83			}, function(err) {
84				if (err)
85					res.send(err);
86				res.json("deleted :(");
87			});
88		});
89	
90	module.exports = router;
