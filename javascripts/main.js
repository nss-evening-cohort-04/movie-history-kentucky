'use strict';
let apiKeys = {};
let uid = "";
let firebaseId = {};

$(document).ready(function() {

function putMoviesIntoDOM(){
  FbAPI.getMovies(apiKeys, uid).then(function(movies){
    movies.forEach(function(movie){
    movieHistor.searchMovieById(movie.movieId).then(function(movieReponse) {
    $("#favorite-movies").append(`<div>`);
    $("#favorite-movies").append(`<h3>${movieReponse.Title} (${movieReponse.Year})</h3>`);
    $("#favorite-movies").append(`<img src="${movieReponse.Poster}"</div>`);
    $("#favorite-movies").append(`</div>`);
    $("#favorite-movies").append(`<button class="btn btn-lg btn-danger col-sm-3 delete-movie-btn data-uid="${uid}" data-fbid="${movie.imdbID}">Delete</button>`);
    })
    });
  });
}

$("#movie-search-btn").on("click", function() {
  $("#searched-movie-output").html("");
	let userMovie = $("#user-movie").val().split(" ").join("+");
	movieHistor.searchMovieByName(userMovie).then(function(movie){
  let userMovieHTML = `<div>`;
  userMovieHTML += `<h3>${movie.Title} (${movie.Year})</h3>`;
  userMovieHTML += `<img class="poster" src="${movie.Poster}">`;
  userMovieHTML += `</div>`;
  userMovieHTML += `<button class="btn btn-lg btn-success col-sm-2 add-movie-btn data-uid="${uid}" data-fbid="${movie.imdbID}">Add</button>`;
  $("#searched-movie-output").append(userMovieHTML);
   });
  });



$("#searched-movie-output").on('click', ".add-movie-btn", function() {
    let newMovie = {
    	"isWatched": "no",
    	"movieId": $(this).data("fbid"),
    	"rating": 0,
    	"uid": uid
    };

    FbAPI.addMovie(apiKeys, firebaseId, newMovie).then(function() {
    console.log("move successfully added");
    });
  });

$("#searched-movie-output").on('click', ".delete-movie-btn", function() {
    let deleteMovie = $(this).data("fbid");
    console.log("fbID", firebaseId);

    FbAPI.deleteMovie(apiKeys, firebaseId, deleteMovie).then(function() {
    console.log("move successfully removed");
    });
  });
























 FbAPI.firebaseCredentials().then(function(keys){
    apiKeys = keys;
    firebase.initializeApp(apiKeys);
  });

$("#registerButton").on('click', function(){
  let userName = $("#inputUsername").val();
  let user = {
    email: $("#inputEmail").val(),
    password: $("#inputPassword").val()
  };
  FbAPI.registerUser(user).then(function(registerResponse){
    console.log("register response", registerResponse);
    let newUser = {
      "username" : userName,
      "uid" : registerResponse.uid
    };
    return FbAPI.addUser(apiKeys, newUser);
  }).then(function(addUserResponse){
    return FbAPI.loginUser(user);
  }).then(function(loginResponse){
    uid = loginResponse.uid;
    createLogoutButton();
    $("#login-container").addClass("hidden");
    $("#main-app").removeClass("hidden");
  });
});

$("#loginButton").on('click', function(){
  let user = {
    email: $("#inputEmail").val(),
    password: $("#inputPassword").val()
  };
  FbAPI.loginUser(user).then(function(loginResponse){
    uid = loginResponse.uid;
    createLogoutButton();
    putMoviesIntoDOM();
    $("#login-container").addClass("hidden");
    $("#main-app").removeClass("hidden");

  });
});



function createLogoutButton() {
  FbAPI.getUser(apiKeys, uid).then(function(userResponse){
    $("#logout-container").html("");
    $("#logout-container").removeClass("hidden");
    firebaseId = userResponse.id;
    console.log("usr", userResponse);
    let currentUserName = userResponse.username;
    let logoutButton = `<button class="btn btn-danger" id="logout-button">LOGOUT ${currentUserName}</button>`;
    $("#logout-container").append(logoutButton);
  });
}

});