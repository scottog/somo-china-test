const express = require('express');
const router = express.Router();

const returnTimestamp = function(req, res, next) {
	const healthcheck = {
		  uptime: process.uptime(),
		  message: 'OK',
		  timestamp: Date.now(),
		  req: {
			  headers: req.headers,
			  _startTime: req._startTime,
			  _remoteAddress: req._remoteAddress,
		  },
	  };
	  try {
		  res.header("Access-Control-Allow-Origin", "*");
		  res.send(healthcheck);
	  } catch (e) {
		  healthcheck.message = e;
		  res.status(503).send();
	  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET health. */
router.get('/health', returnTimestamp);

router.get('/firebase', async (req, res, next) => {
	return returnTimestamp(req,res, next)
});
router.get('/rProxy', async (req, res, next) => {
	console.log(`Request`, req)
	return returnTimestamp(req,res, next)
});
router.get('/fancyProxy', async (req, res, next) => {
	await sleep(100)
	return returnTimestamp(req,res, next)
});
router.get('/vpc', async (req, res, next) => {
	await sleep(100)
	return returnTimestamp(req,res, next)
});
module.exports = router;