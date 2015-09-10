var express = require('express');
2	var router = express.Router();
3	
4	/* GET home page. */
5	router.get('/', function(req, res, next) {
6		res.render('index', { title: "Chirp"});
7	});
8	
9	module.exports = router;
