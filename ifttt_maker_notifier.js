"use strict";

var request = require("request");
var Q = require("q");
var Async = require("async");

var IFTTT_MAKER_CHANNEL_URL = process.env.IFTTT_MAKER_CHANNEL_URL;
if (!IFTTT_MAKER_CHANNEL_URL) {
  throw "IFTTT_MAKER_CHANNEL_URL not setted";
}

class IFTTTMakerNotifier {
  constructor() {
  }

  notify(newMovies) {
    var deferred = Q.defer();

    Async.parallel(
      newMovies.map(function(movie) {
        return function(callback) {
          request.post({
            url: IFTTT_MAKER_CHANNEL_URL,
            formData: {
              value1: `Memovie!:\n${ movie.title }`
            }
          }, function optionalCallback(error, httpResponse, body) {
            callback(error, null);
          });
        }
      }),
      function(error, results) {
        deferred.resolve(results);
      }
    )

    return deferred.promise;
  }
}

module.exports = IFTTTMakerNotifier;
