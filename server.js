// simple server
var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    readFile = require('fs-readfile-promise');
    
var request = require("request");
var creds = require("./.config");
console.log(creds)
// server config
var port = 3000;
var app = express();

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
app.use(bodyParser.json());

// serve data
app.get('/data', function (req,res){
  var payload;
  var options = {
    url: 'https://api.github.com/repos/unicode-cldr/cldr-misc-full/contents/main',
    host: 'api.github.com',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
};
  //read out the main dir to get the list of countries
  request(options, function (err, res) {
    var countries = JSON.parse(res.body);
    var countryDataPromises = countries.map(function(country){
      var options = {
        url: 'https://api.github.com/repos/unicode-cldr/cldr-misc-full/contents/main/' + country.name + '/delimiters.json?client_id=' + creds.id + '&client_secret=' + creds.secret,
        host: 'api.github.com',
        method: 'GET',
        headers: {'user-agent': 'node.js'}
      };
      console.log(options)
      return request(options, function (err, res){
        var countryData = JSON.parse(res.body);
        console.log(countryData);
      })

    });
  });
  fs.readdir(__dirname + '/assets/cldr-misc-full-master/main/', function (err, files){
    // map over the list reading the contents of each country's data and returning an array of promises
    var tuples = files.map(function(country){
      var filePath = __dirname + '/assets/cldr-misc-full-master/main/' + country + '/delimiters.json';
      return readFile(filePath);
    });
    // once the promises resolve
    Promise.all(tuples).then(function(values){
      //map over the country data using the initial list to create tuples of data
      payload = values.map(function(value, key){
        var country = files[key];
        var countryData = JSON.parse(value).main[country].delimiters;
        return [country, countryData];
      });
      // finally send the bucket of tuples to the client
      res.send(payload);
    });
  });
});
console.log('app listening on ', port)
app.listen(port);