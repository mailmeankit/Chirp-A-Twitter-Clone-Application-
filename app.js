var path = require('path');
3	var favicon = require('serve-favicon');
4	var logger = require('morgan');
5	var cookieParser = require('cookie-parser');
6	var bodyParser = require('body-parser');
7	var session = require('express-session');
8	var passport = require('passport');
9	//initialize mongoose schemas
10	require('./models/models');
11	var index = require('./routes/index');
12	var api = require('./routes/api');
13	var authenticate = require('./routes/authenticate')(passport);
14	var mongoose = require('mongoose');                         //add for Mongo support
15	mongoose.connect('mongodb://localhost/test-chirp');              //connect to Mongo
16	var app = express();
17	
18	// view engine setup
19	app.set('views', path.join(__dirname, 'views'));
20	app.set('view engine', 'ejs');
21	
22	// uncomment after placing your favicon in /public
23	//app.use(favicon(__dirname + '/public/favicon.ico'));
24	app.use(logger('dev'));
25	app.use(session({
26	  secret: 'keyboard cat'
27	}));
28	app.use(bodyParser.json());
29	app.use(bodyParser.urlencoded({ extended: false }));
30	app.use(cookieParser());
31	app.use(express.static(path.join(__dirname, 'public')));
32	app.use(passport.initialize());
33	app.use(passport.session());
34	
35	app.use('/', index);
36	app.use('/auth', authenticate);
37	app.use('/api', api);
38	
39	// catch 404 and forward to error handler
40	app.use(function(req, res, next) {
41	    var err = new Error('Not Found');
42	    err.status = 404;
43	    next(err);
44	});
45	
46	//// Initialize Passport
47	var initPassport = require('./passport-init');
48	initPassport(passport);
49	
50	// error handlers
51	
52	// development error handler
53	// will print stacktrace
54	if (app.get('env') === 'development') {
55	    app.use(function(err, req, res, next) {
56	        res.status(err.status || 500);
57	        res.render('error', {
58	            message: err.message,
59	            error: err
60	        });
61	    });
62	}
63	
64	// production error handler
65	// no stacktraces leaked to user
66	app.use(function(err, req, res, next) {
67	    res.status(err.status || 500);
68	    res.render('error', {
69	        message: err.message,
70	        error: {}
71	    });
72	});
73	
74	
75	module.exports = app;
