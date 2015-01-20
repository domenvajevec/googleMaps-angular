var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'What\'s for Lunch', message: 'Yo' });
});

module.exports = router;
