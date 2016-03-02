'use strict';

var send = require('send');
var path = require('path');
var url = require('url');
var argv = require('yargs')
    .default({
        port: 4246,
        loc: 'en_US',
        app: 'betcoin',
    })
    .argv;

var logger = require('winston');

var rootDir = __dirname;

var responseFunc = function(req, res) {
    var parsedUrl = url.parse(req.url);

    if (req.method === 'OPTIONS' && req.headers['access-control-request-method']) {
        if (req.headers['access-control-request-mothod'] !== 'GET') {
            res.writeHead(403);
            return res.end("invalid request method");
        }
        res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
        res.setHeader('access-control-allow-methods', 'GET');
        res.setHeader('access-control-allow-origin', '*');
        res.writeHead(204);
        return res.end();
    }
    if (req.headers.origin) {
        res.setHeader('access-control-allow-origin', '*');
    }
    var requestPath = parsedUrl.path;
    if (!requestPath) {
        requestPath = '/';
    }
    // get the right directory for the locale
    var indexDir = rootDir + "/build";
    logger.info("trying to get %s", path.resolve(indexDir, requestPath));
    // try to get the actual requested file/directory
    send(req, requestPath, {root: indexDir}).on('error', function() {
        // if we could not find it
        if ((/\.[a-z]{1,4}$/).test(req.url)) {
            // if it is a single file, return a 404
            res.statusCode = 404;
            return res.end();
        } else {
            // if a "directory" was requested, serve the index
            requestPath = '/index.html';
        }
        logger.info('failed once, trying %s', path.resolve(indexDir,requestPath));
        send(req, requestPath, {root: indexDir}).on('error', function() {
            res.statusCode = 404;
            logger.info('404 - %s', path.resolve(indexDir, requestPath));
            res.end('not found');
        }).pipe(res);
    }).pipe(res);
};

var server = require('http').createServer(responseFunc);

server.listen(argv.port, function(err) {
    if (err) { throw err; }
    logger.info('started %s server on port %d', argv.ssl ? 'https' : 'http', argv.port);
});
