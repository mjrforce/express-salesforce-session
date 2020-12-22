var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.send('Welcome to Salesforce.');
});

// eslint-disable-next-line no-undef
module.exports = router;
