'use strict';
let apiKeys = {};
let uid = "";
let firebaseId = {};

$(document).ready(function() {

function putMoviesIntoDOM(){
  FbAPI.getMovies(apiKeys, uid).then(function(movies){
    $("#favorite-movies").html("");
    movies.forEach(function(movie){
    movieHistor.searchMovieById(movie.movieId).then(function(movieReponse) {
       $("#favorite-movies").append(`
        <div class="col-md-4 favorite-card">
            <h3 class="center">${movieReponse.Title} (${movieReponse.Year})</h3>
                <img class="center" src="${movieReponse.Poster}">
                <h4 class="center">Seent It: ${movie.isWatched}</h4>
                <h4 class="center">My Rating: ${movie.rating}</h4>
                <h4 class="center">Actors: ${movieReponse.Actors}</h4>
            <button class="btn btn-danger col-sm-2 delete-movie-btn data-uid="${uid}" data-fbid="${movie.id}">Delete</button>
        </div>`);
      });
    });
  });
}

$("#movie-search-btn").on("click", function() {
  $("#searched-movie").html("");
	let userMovie = $("#user-movie").val().split(" ").join("+");
	movieHistor.searchMovieByName(userMovie).then(function(movie){
  let userMovieHTML = `<div>`;
  userMovieHTML += `<h3>${movie.Title} (${movie.Year})</h3>`;
  userMovieHTML += `<img src="${movie.Poster}">`;
  userMovieHTML += `<h4>My Rating</h4><select id="ratingSelect"><option value="1">1 Star</option><option value="2">2 Stars</option><option value="3">3 Stars</option><option value="4">4 Stars</option><option value="5">5 Stars</option></select>`;
  userMovieHTML += `<h4>Seent it?<select id="seentIt"><option value="Yes">Yes</option><option value="No">No</option></select></h4>`;
  userMovieHTML += `<h4>Actors: ${movie.Actors}</h4>`;
  userMovieHTML += `<button class="btn btn-lg btn-success col-sm-1 col-sm-offset-1 add-movie-btn data-uid="${uid}" data-fbid="${movie.imdbID}">Add</button>`;
  userMovieHTML += `</div>`;
  $("#searched-movie").append(userMovieHTML);
   });
  });



$("#user-search-results").on('click', ".add-movie-btn", function() {
    let newMovie = {
    	"isWatched": $("#seentIt").val(),
    	"movieId": $(this).data("fbid"),
    	"rating": $("#ratingSelect").val(),
    	"uid": uid
    };

    FbAPI.addMovie(apiKeys, firebaseId, newMovie).then(function() {
    alertify.success('Movie added to favorites');
    putMoviesIntoDOM();
    $("#searched-movie").html("");
    $("#user-movie").val("");
    $("#user-movie").focus();
    });
  });

$("#favorites-container").on('click', ".delete-movie-btn", function() {
    let movieId = $(this).data("fbid");

    FbAPI.deleteMovie(apiKeys, movieId).then(function() {
    alertify.error('Movie removed from favorites');
      putMoviesIntoDOM();
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
    $("#search-buttons").removeClass("hidden");
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
    $("#search-buttons").removeClass("hidden");

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

$("#show-favorites").on('click', function(){
  $("#favorites-container").removeClass("hidden");
  $("#user-search-results").addClass("hidden");
  $("#search-bar").addClass("hidden");
});

$("#show-search").on('click', function(){
  $("#favorites-container").addClass("hidden");
  $("#user-search-results").removeClass("hidden");
  $("#search-bar").removeClass("hidden");
});


$("#logout-container").on("click", "#logout-button", function() {
    FbAPI.logoutUser();
    uid = "";
    $("#inputEmail").val('');
    $("#inputPassword").val('');
    $("#inputUsername").val('');
    $("#login-container").removeClass("hidden");
    $("#search-bar").addClass("hidden")
    $("#search-buttons").addClass("hidden");
    $("#favorites-container").addClass("hidden");
    $("#logout-container").addClass("hidden");
    $("#inputEmail").focus();
});


});