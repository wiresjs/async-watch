var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/src'));
var port = process.env.PORT || 3022;
var server = app.listen(port, function() {
   var host = server.address().address;
   console.log('Example app listening at http://%s:%s', host, port);
});
