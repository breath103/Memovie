"use strict";

var NaverMovieCralwer = require("./naver_movie_crawler");
var MoviesStorage = require("./movies_storage");
var IFTTTMakerNotifier = require("./ifttt_maker_notifier");

class MovieWatcher {
  constructor() {
    this.movieCrawler = new NaverMovieCralwer();
    this.moviesStorage = new MoviesStorage();
  }
  run(callback) {
    var self = this;

    self.movieCrawler.crawl().then(function(movies){
      return self.moviesStorage.update(movies);
    }).then(function(addedMovies, deletedMovies) {
      var movieNotifier = new IFTTTMakerNotifier();

      console.log("changed : ", addedMovies);

      return movieNotifier.notify(addedMovies);
    }).then(function(result) {
      callback();
    });
  }
}

module.exports = MovieWatcher;
