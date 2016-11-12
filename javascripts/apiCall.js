"use strict";
var movieHistor = (function() {
    return {
        searchMovieByName: function(userMovie) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    method: 'GET',
                    url: 'https://www.omdbapi.com/?s=' + userMovie
                }).then((response) => {
                    resolve(response.Search);
                }, (error) => {
                    reject(error);
                });
            });
        },
        searchMovieById: function(movieId) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    method: 'GET',
                    url: `http://www.omdbapi.com/?i=${movieId}&plot=short&r=json`
                }).then((response) => {
                    resolve(response);
                    //console.log("response from api id call", response);
                }, (error) => {
                    reject(error);
                });
            });
        },
    };
})();