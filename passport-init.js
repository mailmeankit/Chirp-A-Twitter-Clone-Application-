var mongoose = require('mongoose');   
2	var User = mongoose.model('User');
3	var LocalStrategy   = require('passport-local').Strategy;
4	var bCrypt = require('bcrypt-nodejs');
5	
6	module.exports = function(passport){
7	
8		// Passport needs to be able to serialize and deserialize users to support persistent login sessions
9		passport.serializeUser(function(user, done) {
10			console.log('serializing user:',user.username);
11			done(null, user._id);
12		});
13	
14		passport.deserializeUser(function(id, done) {
15			User.findById(id, function(err, user) {
16				console.log('deserializing user:',user.username);
17				done(err, user);
18			});
19		});
20	
21		passport.use('login', new LocalStrategy({
22				passReqToCallback : true
23			},
24			function(req, username, password, done) { 
25				// check in mongo if a user with username exists or not
26				User.findOne({ 'username' :  username }, 
27					function(err, user) {
28						// In case of any error, return using the done method
29						if (err)
30							return done(err);
31						// Username does not exist, log the error and redirect back
32						if (!user){
33							console.log('User Not Found with username '+username);
34							return done(null, false);                 
35						}
36						// User exists but wrong password, log the error 
37						if (!isValidPassword(user, password)){
38							console.log('Invalid Password');
39							return done(null, false); // redirect back to login page
40						}
41						// User and password both match, return user from done method
42						// which will be treated like success
43						return done(null, user);
44					}
45				);
46			}
47		));
48	
49		passport.use('signup', new LocalStrategy({
50				passReqToCallback : true // allows us to pass back the entire request to the callback
51			},
52			function(req, username, password, done) {
53	
54				// find a user in mongo with provided username
55				User.findOne({ 'username' :  username }, function(err, user) {
56					// In case of any error, return using the done method
57					if (err){
58						console.log('Error in SignUp: '+err);
59						return done(err);
60					}
61					// already exists
62					if (user) {
63						console.log('User already exists with username: '+username);
64						return done(null, false);
65					} else {
66						// if there is no user, create the user
67						var newUser = new User();
68	
69						// set the user's local credentials
70						newUser.username = username;
71						newUser.password = createHash(password);
72	
73						// save the user
74						newUser.save(function(err) {
75							if (err){
76								console.log('Error in Saving user: '+err);  
77								throw err;  
78							}
79							console.log(newUser.username + ' Registration succesful');    
80							return done(null, newUser);
81						});
82					}
83				});
84			})
85		);
86		
87		var isValidPassword = function(user, password){
88			return bCrypt.compareSync(password, user.password);
89		};
90		// Generates hash using bCrypt
91		var createHash = function(password){
92			return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
93		};
94	
95	};
