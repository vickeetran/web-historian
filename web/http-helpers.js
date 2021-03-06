var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');
var request = require('request');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(req, res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var home = '/';
  var url = req.url;
  var urlInput;

  if (req.method === 'GET') {
    if (url === home) {
      fs.readFile(archive.paths.index, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200);
          res.end(data);
        }
      });
    } else if ('/' + url.split('.')[1] + '/' === '/' + undefined + '/') { 
      console.log('404 ------------------------------');
      res.writeHead(404);
      res.end();
    } else {
      var fixtureUrl = '/' + url.split('.')[1] + '/';
      console.log('this is the fixture url', fixtureUrl);
      res.writeHead(200);
      res.end(fixtureUrl);
    }
  }


  if (req.method === 'POST') {
  
    var body = '';
    req.on('data', function(data) {
      console.log('1the data is-----------', data);
      body += data;
    });

    req.on('end', function() {
      urlInput = qs.parse(body);
      urlInput = urlInput.url;
        
      archive.isUrlArchived(urlInput, (result) => {
        if (result === false) { 
          console.log('YOU SHOULDN\'T BE HERE', result); 
          archive.addUrlToList(urlInput, (err) => {
            if (err) {
              console.log('we have error', err);
            } else {
              console.log('3append success!!!!!!!!!!!!!!!!!'); 
              res.writeHead(200);
             
            }
          });
          fs.readFile(archive.paths.loading, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log('heyo!');
              res.writeHead(302);
            }
            res.end(data); 
          });
        } else if (result === true) {
          console.log('BOOOOOOOO');
          fs.readFile(archive.paths.archivedSites + '/' + urlInput, (err, data) => {
            console.log('archiveSAVED SITE', archive.paths.archivedSites + '/' + urlInput);
            if (err) {
              console.log(err);
            } else {
              console.log('heyo!');
              res.writeHead(302);
              res.write(data);
            }
            res.end(); 
          });
        }
      });
    });
  }
};



// As you progress, keep thinking about what helper functions you can put here!
