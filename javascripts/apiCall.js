"use strict";
var movieHistor = (function() {
    return {
        getMovies: function(userMovie) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    method: 'GET',
                    url: `http://www.omdbapi.com/?t=${userMovie}&y=&plot=short&r=json`
                }).then((response) => {
                    resolve(response);
                    console.log("response from api call", response);
                }, (error) => {
                    reject(error);
                });
            });
        }
    };
})();