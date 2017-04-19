const express = require('express');
const router = express.Router();

// router.get('/', function(req, res, next){
// 	res.status(200);
// 	res.send('<h1>Hello Andriy! ' + req.connection.remoteAddress + '</h1>');
// });

router.get('/chat', function(req, res, next){
	res.status(200);
	res.send('<h1>Chat</h1>');
});

module.exports = router;