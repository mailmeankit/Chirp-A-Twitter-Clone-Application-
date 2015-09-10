var express = require('express');
2	var router = express.Router();
3	
4	module.exports = function(passport){
5	
6		//sends successful login state back to angular
7		router.get('/success', function(req, res){
8			res.send({state: 'success', user: req.user ? req.user : null});
9		});
10	
11		//sends failure login state back to angular
12		router.get('/failure', function(req, res){
13			res.send({state: 'failure', user: null, message: "Invalid username or password"});
14		});
15	
16		//log in
17		router.post('/login', passport.authenticate('login', {
18			successRedirect: '/auth/success',
19			failureRedirect: '/auth/failure'
20		}));
21	
22		//sign up
23		router.post('/signup', passport.authenticate('signup', {
24			successRedirect: '/auth/success',
25			failureRedirect: '/auth/failure'
26		}));
27	
28		//log out
29		router.get('/signout', function(req, res) {
30			req.logout();
31			res.redirect('/');
32		});
33	
34		return router;
35	
36	}
