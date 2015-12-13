"use strict";

require('dotenv').load();

var MovieWatcher = require('./movie_watcher');
var watcher = new MovieWatcher();

watcher.run(function(){
  process.exit(0);
});
