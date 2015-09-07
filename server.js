var express = require('express');

var app = express();
console.log('Starting server...');
app.use(express.static(__dirname + '/public'));

app.listen(8000);