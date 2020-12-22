var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var config = require('../../utils/config');
var path = require('path');

router.use(express.json());
var oauth2 = new jsforce.OAuth2(config.OAUTH_SETTINGS);

router.get('/', function (req, res) {
    res.send('Welcome to oauth.');
});

router.get('/config', function (req, res){
   res.json(config.OAUTH_SETTINGS);
});

/* GET home page. */
router.get('/auth', function (req, res) {
    res.redirect(oauth2.getAuthorizationUrl({ scope: 'api openid web' }));
});

router.post('/logout', function (req, res) {
    var data = req.body;
    var conn = new jsforce.Connection(data);
    conn.logout(function (err) {
        if (err) {
            console.error(err);
            res.json({ success: true, err: err });
        }
        res.json({ success: true });
    });

});

router.get('/authurl', function (req, res) {
    var resjson = {};
    resjson.URL = oauth2.getAuthorizationUrl({ scope: 'api id web' });
    res.json(resjson);
});

router.get('/callback', function (req, res) {
    // eslint-disable-next-line no-undef
    res.render(path.join(__dirname, '../src/client/oauth/callback.html'));
});

router.post('/postback', function(req, res) {
    req.io.emit('postback', { message: req.body });
    res.send(200);
});

router.get('/login', function(req, res){
   var params = 'response_type=' + req.query.response_type + 
                '&client_id=' + req.query.client_id + 
                '&redirect_uri=' + req.query.redirect_uri + 
                '&state=' +  req.query.state;
  
   res.redirect('https://login.salesforce.com/services/oauth2/authorize?' + params);
});

// eslint-disable-next-line no-undef
module.exports = router;
