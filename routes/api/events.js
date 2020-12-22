var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.send('Welcome to Events.');
});

router.post('/postback', function(req, res) {
    req.io.emit('postback', { message: req.body });
    res.send(200);
});

// eslint-disable-next-line no-undef
module.exports = router;
