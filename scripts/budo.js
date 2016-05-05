#!/usr/bin/env node

var exec = require('child_process').exec;
var budo = require('budo');

function execCmd (cmd) {
  var p = exec(cmd);
  p.stderr.pipe(process.stderr);
  p.stdout.pipe(process.stdout);
  return p;
}

var consts = {
  NAME: 'MAZEVR',
  WATCH: 'examples/**/*',  // Additional files to watch for LiveReload
  ENTRY: 'examples/main.js',
  PORT: 9005
};

var opts = {
  debug: process.env.NODE_ENVIRONMENT !== 'production',
  verbose: true,
  live: true,
  stream: process.stdout,
  host: process.env.HOST,
  port: process.env.PORT || consts.PORT,
  watchGlob: consts.WATCH,
  browserifyArgs: ['-s', consts.NAME],
  middleware: function (req, res, next) {
    next();
  }
};

var app = budo(consts.ENTRY, opts);
app.on('update', function () {
 // execCmd('semistandard -v | snazzy');
});
