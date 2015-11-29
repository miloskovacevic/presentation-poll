
var express = require('express');

var app = express();

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

app.listen(3000);

console.log('Polling server is running at localhost:3000/ ');
