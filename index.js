'use strict';
var pkg = require('./package');
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var File = require('vinyl');

// consts
module.exports = function(out, options) {

  options = options || {};

  var files = [];
  var fileList = [];

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(pkg.name, 'Streams not supported'));
      return;
    }

    files.push(file);

    var filePath;
    if (options.absolute) {
      filePath = path.normalize(file.path);
    } else if (options.flatten) {
      filePath = path.basename(file.path);
    } else {
      filePath = path.relative(process.cwd(), file.path);
    }
    fileList.push(filePath);

    this.push(file);
    cb();
  }, function(cb) {
    var fileListFile = new File({
      path: out,
      contents: new Buffer(JSON.stringify(fileList, null, '  '))
    });

    this.push(fileListFile);
    cb();
  });
};
