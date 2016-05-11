angular
  .module('controllers', [])
  .controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, $ionicPlatform, GeoServices) {
  console.log('HomeCtrl loaded.');

  // Expose global variable
  var vm = this;

  // Init vars
  vm.geoData = {};
  var heartbeat = 1000; // Interval time for checking location

  // Callback
  var callback = function() {
    function apply() {
      vm.geoData = GeoServices.getPosition();
      console.log('Current position: ' + vm.geoData.latitude + ', ' + vm.geoData.longitude + ' @ ' + vm.geoData.speed + ' m/s.');
    }

    // Async data binding
    $scope.$apply(apply());
  };

  // On Platform ready
  $ionicPlatform.ready(function() {
    $scope.interval = setInterval(function() {
      GeoServices.checkLocation(callback);
    }, heartbeat);

    // backgroundGeoLocation IMPLEMENTATION
    // NOTE: backgroundGeoLocation will cause errors unless its simulated properly!!

    // backgroundGeoLocation success call
    var bgSuccess = function(location) {
      console.log('backgroundGeoLocation callback : ', vm.geoData);

      // DO ALL OTHER BACKGROUND LOCATION IMPLEMENTATION HERE!!
      // esp: HTTP POST requests, or POST to server

      /*
      IMPORTANT !!!
      You must execute the finish method to inform the native plugin that we're done doing background tasks.
      You must do this regardless if said tasks actually finished.
      OTHERWISE, iOS/Android will kill the app for using too much background compute time.
      */

      backgroundGeoLocation.finish();
    };

    // backgroundGeoLocation failure call
    var bgFailure = function(error) {
      console.log('backgroundGeoLocation error', error);
    };

    // backgroundGeoLocation options
    var bgOptions = {
      notificationText: 'DISABLED',
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, // Enable sound upon backgroundGeoLocation cycle
      stopOnTerminate: false // Enable to clear settings upon app termination.
    };

    backgroundGeoLocation.configure(bgSuccess, bgFailure, bgOptions);
    backgroundGeoLocation.start();

    // ./ backgroundGeoLocation IMPLEMENTATION
  });

  // On View enter
  $scope.$on('$ionicView.enter', function(e) {
    clearInterval($scope.interval);

    $scope.interval = setInterval(function() {
      GeoServices.checkLocation(callback);
    }, heartbeat);
  });
}
