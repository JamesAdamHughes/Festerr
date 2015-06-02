var express = require('express');
var app = express();

app.use(express.static('public'));

// respond with "Hello World!" on the homepage
app.get('/', function (req, res) {
  res.render('test.html');
});



var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

