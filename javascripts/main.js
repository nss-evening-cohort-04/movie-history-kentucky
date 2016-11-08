'use strict';
let apiKeys = {};
let uid = "";

$(document).ready(function() {

function putMoviesIntoDOM(){
  FbAPI.getMovies(apiKeys, uid).then(function(movies){
    movies.forEach(function(movie){
      console.log(movie);
    let movieToDom = movieHistor.searchMovieById(movie.movieId);
    console.log(movieToDom);

    });
  });
};

$("#movie-search-btn").on("click", function() {
	let userMovie = $("#user-movie").val().split(" ").join("+");
	 movieHistor.searchMovieByName(userMovie);
	 console.log("movie", userMovie);
   putMoviesIntoDOM();
});


	$("#add-movie-btn").on('click', function() {
		let newMovie = {
			"movieId": $("#addTaskText").val(),
			"uid": uid
		};
		FbAPI.addMovie(apiKeys, newMovie).then(function() {

		});
	});
























 FbAPI.firebaseCredentials().then(function(keys){
    console.log("keys", keys);
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
    // putTodoInDOM();
    $("#login-container").addClass("hidden");
    $("#main-app").removeClass("hidden");

  });
});



function createLogoutButton() {
  FbAPI.getUser(apiKeys, uid).then(function(userResponse){
    $("#logout-container").html("");
    $("#logout-container").removeClass("hidden");
    console.log(userResponse);
    let currentUserName = userResponse.username;
    let logoutButton = `<button class="btn btn-danger" id="logout-button">LOGOUT ${currentUserName}</button>`;
    $("#logout-container").append(logoutButton);
  });
}

});