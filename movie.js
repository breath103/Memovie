"use strict";

class Movie {
  constructor(object) {
    this.title        = object.title;
    this.imageUrl     = object.imageUrl;
    this.peopleRating = object.peopleRating;
    if (object.criticRating) {
      this.criticRating = object.criticRating;
    }
  }
  equals(other) {
    return this.title === other.title;
  }
}

module.exports = Movie;
