"use strict";
var FbAPI = (function(oldFirebase) {
    oldFirebase.getUser = function(apiKeys, uid) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url:`${apiKeys.databaseURL}/users.json?orderBy="uid"&equalTo="${uid}"`
            }).then((response) => {
                let users = [];
                Object.keys(response).forEach(function(key) {
                    response[key].id = key;
                    users.push(response[key]);
                });
                resolve(users[0]);
            }, (error) => {
                reject(error);
            });
        });
    };
    oldFirebase.addUser = function(apiKeys, newUsers) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'POST',
                url:`${apiKeys.databaseURL}/users.json`,
                data: JSON.stringify(newUsers),
                dataType:'json'
            }).then((response) => {
                console.log("response from POST", response);
                resolve(response);
            }, (error) => {
                reject(error);
            });
        });
    };
return oldFirebase;
})(FbAPI || {});