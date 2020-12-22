var express = require('express');
var router = express.Router();
const oauth = require('./oauth');
const events = require('./events');
const salesforce = require('./salesforce');
const session = require('./session');


router.get('/', function (req, res) {
	res.send('Welcome to API.');
});

router.use('/oauth', oauth);
router.use('/events', events);
router.use('/salesforce', salesforce);
router.use('/session', session);

router.get('/key', function(req, res, next){
	var apikey = require('../../utils/apikey')(req.pool);
	res.json(apikey.generate());
});

router.get('/validate', async function(req, res, next){
	var apikey = require('../../utils/apikey')(req.pool);
	apikey.validate(req.query.key).then(function(response){
		console.log('response: ' + JSON.stringify(response));
		res.json(response);
	}); 
});
// eslint-disable-next-line no-undef
module.exports = router;
