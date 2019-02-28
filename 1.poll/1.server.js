const express = require('express');
const app = express();
const path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index2.html'));
});
app.get('/clock', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  setTimeout(() => {
    res.end(new Date().toLocaleString());
  }, 10 * 1000);
  
});
app.listen(8080);