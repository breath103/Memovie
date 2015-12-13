"use strict";

var Crawler = require("crawler");
var url = require('url');
var Movie = require("./movie");
var Q = require('q');

class NaverMovieCralwer {
  // This return promise
  crawl() {
    var deferred = Q.defer();

    var crawler = new Crawler({ maxConnections : 10 });
    crawler.queue([{
      uri: 'http://movie.naver.com/movie/running/current.nhn',
      callback: function (error, result, $) {
        var $list = $("#content ul.lst_detail_t1");
        var $items = $list.find("li");

        var movies = Array.prototype.map.call($items, function(item) {
          var $item = $(item);
          var movie = {};

          // Image
          var $img = $item.find(".thumb a img");
          var imgSrc = $img.attr("src");

          movie.imageUrl = imgSrc;

          // Title
          var $title = $item.find(".lst_dsc .tit a");
          var title = $title.text();

          movie.title = title;

          var $ratings = $item.find(".star_t1 .num");
          // People Raiting
          var $peopleRating = $($ratings[0]);
          var peopleRating = Number.parseFloat($peopleRating.text());

          movie.peopleRating = peopleRating;

          // Critic Raiting
          var $criticRating = $($ratings[1]);
          if ($criticRating[0]) {
            var criticRating = Number.parseFloat($criticRating.text());
            movie.criticRating = criticRating;
          }

          return new Movie(movie);
        });

        // Resolve Deferred
        deferred.resolve(movies);
      }
    }]);

    return deferred.promise;
  }
}

module.exports = NaverMovieCralwer
