var express = require('express');
var router = express.Router();

/* GET form page. */
router.get('/form', function(req, res) {
  res.send('bob was here');
});

module.exports = router;