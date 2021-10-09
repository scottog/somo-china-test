var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/health', function(req, res, next) {
  res.send({ status: 200, body: 'healthy' })
});


module.exports = router;
