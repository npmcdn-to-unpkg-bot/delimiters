var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path');
    fs = require('fs');
    readFile = require('fs-readfile-promise');

// server config
var port = 3000;
var app = express();

// create a simple server
// webpack
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.dev.config.js');
var compiler = webpack(config);

app.use(webpackHotMiddleware(compiler));
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

// serve static files
app.use(express.static(path.join(__dirname)));



// serve assets
app.get('/data', function (req,res){
  var payload;
  fs.readdir(__dirname + '/assets/cldr-misc-full-master/main/', function (err, files){
    // res.send(files);
    var tuples = files.map(function(country){
      var filePath = __dirname + '/assets/cldr-misc-full-master/main/' + country + '/delimiters.json';
      return readFile(filePath);
    });
  
    Promise.all(tuples).then(function(values){
      payload = values.map(function(value, key){
        var country = files[key];
        var countryData = JSON.parse(value).main[country].delimiters;
        console.log(countryData);
        return [country, countryData];
      });
      res.send(payload);
    });
  });
});

app.get('/list', function(req,res){
});


app.listen(port);