// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('HomeCtrl',function($scope){
$scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
  $scope.movie = {
    src : "https://www.youtube.com/embed/dKrVegVI0Us",
    title : "Egghead.io AngularJS Binding"
  };


})
.service('Films', function ($http, $q){

  this.get = function() {
    var dfd = $q.defer();

    $http.get('Films.json')
    .success(function(data) {
      dfd.resolve(data);
    })
    .error(function(data) {
      dfd.reject(data);
    });

    return dfd.promise;
  };
})
.controller('FilmsCtrl', function($scope, $http, Films, $ionicLoading) {
  $scope.films = [];


  $ionicLoading.show({
    template: 'Loading...'
  });
    

  Films.get()
  .then(function(films){
    $scope.films = films;

    $ionicLoading.hide();
  },function(err){
    $ionicLoading.hide();
  });

  $scope.goToUrl = function(url){
    //use inAppBrowser plugin
    window.open(url, '_blank', 'location=yes');
  }
})
.directive('dynamicUrl', function () {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attr) {
            element.attr('src', attr.dynamicUrlSrc);
        }
    };
})
.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'admin' && pw == 'admin') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
.controller('inscriptionController', function ($scope, $state) {

        $scope.email = "";
        $scope.confemail = "";
        $scope.password = "";
        $scope.confpassword = "";
        $scope.erreur = "";

        $scope.submit = function (form) {
            console.log("submit controller");
            console.log("Email  :", form.email.$modelValue, "  ConfEmail  :", form.confemail.$modelValue);
            console.log("Pass   :", form.password.$modelValue, "  ConfPass   :", form.confpassword.$modelValue);
            if ((form.email.$modelValue == form.confemail.$modelValue) && (form.email.$modelValue != undefined)) {
                if ((form.password.$modelValue == form.confpassword.$modelValue) && (form.password.$modelValue != undefined)) {
                    console.log("All OK !");
                    $scope.erreur = "";
                    $state.go('login');
                } else {
                    console.log("Passwords doesnt match");
                    $scope.erreur = "Passwords doesnt match";
                }
            } else {
                console.log("Emails doesnt match");
                $scope.erreur = "Mails doesnt match";
            }
        }

        $scope.dev = function () {
            $scope.email = "fzwael@gmail.com"
            $scope.confemail = "fzwael@gmail.com";
            $scope.password = "fzwael@gmail.com";
            $scope.confpassword = "fzwael@gmail.com";
        }
    })
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('home');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Verifier votre Login ou mot de passe!'
            });
        });
    }
})

.config(function($stateProvider,$urlRouterProvider)
{
	$stateProvider.state('home',
	{
	url:'/home',
	templateUrl:'templates/home.html',
  controller:'HomeCtrl'
	})
  $stateProvider.state('listfilm',
  {
  url:'/listfilm',
  templateUrl:'templates/listfilm.html'
  })
  $stateProvider.state('film',
  {
  url:'/film',
  templateUrl:'templates/film.html',
  controller: 'FilmsCtrl',
  })
  $stateProvider.state('login',
  {
  url:'/login',
  templateUrl:'templates/login.html',
  controller: 'LoginCtrl'
  }
  )
   $stateProvider.state('inscription',
  {
  url:'/inscription',
  templateUrl:'templates/inscription.html',
  controller: 'inscriptionController',
  }
  )
	$urlRouterProvider.otherwise('/login')

}
);