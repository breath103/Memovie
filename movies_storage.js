"use strict";

var redis = require("redis");
var Movie = require("./movie");
var Q     = require("q");

module.exports = class MoviesStorage {
  constructor() {
    this.client = redis.createClient(process.env.REDIS_URL);
  }

  _difference(a, b) {
    return a.filter(function(itemA) {
      return b.filter(function(itemB){
        var isEqual = itemA.equals(itemB);
        return isEqual;
      }).length == 0
    });
  }

  update(newMovies) {
    var deferred = Q.defer();

    var self = this;
    var storeKey = "movies-20151215";

    self.client.get(storeKey, function(error, moviesJSON) {
      var storedMovies = [];
      if (moviesJSON) {
        storedMovies = JSON.parse(moviesJSON).map(function(movie){
          return new Movie(movie);
        });
      }

      var addedMovies   = self._difference(newMovies, storedMovies);
      var deletedMovies = self._difference(storedMovies, newMovies);

      self.client.set(storeKey, JSON.stringify(newMovies), function(error){
        if (error) {
          deferred.reject(error);
        } else {
          deferred.resolve(addedMovies, deletedMovies);
        }
      });
    });

    return deferred.promise;
  }
}
