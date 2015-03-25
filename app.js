/* eslint-disable no-alert, no-underscore-dangle, eol-last, no-use-before-define */
/* global alert, angular, Kido */
(function(angular, Kido) {
    "use strict";

    var app = angular.module("KidoAngularSample", []);

    app.factory("KidoZen", function($q) {

        // Authentication is handled by KidoZen automatically
        // since this is a web app hosted in the KidoZen cloud.
        var appName = "app-name",
            marketplace = "company.kidocloud.com",
            secretKey = "s3cr3t-k3y",
            kido = new Kido(appName, marketplace, {
                secretKey: secretKey
            });

        return {
            getPeople: getPeople,
            createPerson: createPerson,
            deletePerson: deletePerson
        };

        // An object set called "people" will be created for your app.
        function getObjectSet() {
            return kido.storage().objectSet("people");
        }

        function getPeople() {
            return $q(function(resolve, reject) {
                getObjectSet()
                    .query()
                    .done(resolve)
                    .fail(reject);
            });
        }

        function createPerson(person) {
            return $q(function(resolve, reject) {
                getObjectSet()
                    .insert(person)
                    .done(resolve)
                    .fail(reject);
            });
        }

        function deletePerson(personId) {
            return $q(function(resolve, reject) {
                getObjectSet()
                    .del(personId)
                    .done(resolve)
                    .fail(reject);
            });
        }

    });

    app.controller("HomeCtrl", function($scope, KidoZen) {

        init();

        function init() {
            $scope.items = [];
            resetFields();
            loadInitialData();
            setListeners();
        }

        function resetFields() {
            $scope.firstName = "";
            $scope.lastName = "";
        }

        function loadInitialData() {
            showLoadingIndicator(true);
            KidoZen
                .getPeople()
                .then(function(result) {
                    $scope.items = result;
                })
                .catch(function(error) {
                    alert(String(error));
                })
                .finally(function() {
                    showLoadingIndicator(false);
                });
        }

        function setListeners() {
            $scope.onAddPersonClick = onAddPersonClick;
            $scope.onRemovePersonClick = onRemovePersonClick;
        }

        function showLoadingIndicator(isLoading) {
            $scope.isLoading = isLoading;
        }

        function onAddPersonClick() {
            var person = {
                firstName: $scope.firstName,
                lastName: $scope.lastName
            };
            resetFields();
            showLoadingIndicator(true);
            KidoZen
                .createPerson(person)
                .then(function(result) {
                    $scope.items.push(result);
                })
                .catch(function(error) {
                    alert(String(error));
                })
                .finally(function() {
                    showLoadingIndicator(false);
                });
        }

        function onRemovePersonClick(personId) {
            showLoadingIndicator(true);
            KidoZen
                .deletePerson(personId)
                .then(function() {
                    $scope.items = $scope.items.filter(function(item) {
                        return item._id !== personId;
                    });
                })
                .catch(function(error) {
                    alert(String(error));
                })
                .finally(function() {
                    showLoadingIndicator(false);
                });
        }

    });

})(angular, Kido);