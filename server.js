var express = require('express'),
    bodyParser = require('body-parser'),
    Promise = require('bluebird'),
    path = require('path'),
    fs = require('fs'),
    readFile = require('fs-readfile-promise'),
    request = Promise.promisify(require("request")),
    creds = require("./.config");

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
// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve data
app.get('/data', function (req,res){
  var payload;
  var options = {
    url: 'https://api.github.com/repos/unicode-cldr/cldr-misc-full/contents/main?client_id=' + creds.id + '&client_secret=' + creds.secret,
    host: 'api.github.com',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  };
  //read out the main dir to get the list of countries
  request(options, function (err, data) {
    if (err) {
      console.log(err);
    }
    var countries = JSON.parse(data.body);
    var countryDataPromises = countries.map(function(country){
      var options = {
        url: 'https://api.github.com/repos/unicode-cldr/cldr-misc-full/contents/main/' + country.name + '/delimiters.json?client_id=' + creds.id + '&client_secret=' + creds.secret,
        host: 'api.github.com',
        method: 'GET',
        headers: {'user-agent': 'node.js'}
      };
        return request(options);
    });
    countryDataPromises = countryDataPromises.filter(function (data){
      return data !== null;
    });

    Promise.all(countryDataPromises).then(function(values){
      if (err) {
        console.log(err);
      }
      //map over the country data using the initial list to create tuples of data
      payload = values.map(function(value, key){
        var country = countries[key];
        if (value) {
        // parse body to get json
          var body = JSON.parse(value.body).content;
          // decode contents of repo
          var data = new Buffer (body, 'base64').toString();
          data = JSON.parse(data);
        return [country.name, data.main[country.name].delimiters];
      } else {
        return null;
      }
      });
      res.send(payload);
    })
  });
});
console.log('app listening on ', port)
app.listen(port);