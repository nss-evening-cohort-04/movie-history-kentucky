"use strict";
var FbAPI = (function(oldFirebase) {
    oldFirebase.getMovies = function(apiKeys, uid) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url:`${apiKeys.databaseURL}/favorites.json?orderBy="uid"&equalTo="${uid}"`
            }).then((response) => {
                let movies = [];
                Object.keys(response).forEach(function(key) {
                    response[key].id = key;
                    movies.push(response[key]);
                });
                resolve(movies);
            }, (error) => {
                reject(error);
            });
        });
    };
    oldFirebase.addMovie = function(apiKeys, firebaseId, newMovie) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'POST',
                url:`${apiKeys.databaseURL}/favorites.json`,
                data: JSON.stringify(newMovie),
                dataType:'json'
            }).then((response) => {
                console.log("response from POST", response);
                resolve(response);
            }, (error) => {
                reject(error);
            });
        });
    };
    oldFirebase.deleteMovie = function(apiKeys, movieId) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'DELETE',
                url:`${apiKeys.databaseURL}/favorites/${movieId}.json`,
            }).then((response) => {
                console.log("response from DELETE", response);
                resolve(response);
            }, (error) => {
                reject(error);
            });
        });
    };

    return oldFirebase;
})(FbAPI || {});