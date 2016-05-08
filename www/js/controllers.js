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
      console.log('Current position: ' + vm.geoData.latitude + ', ' + vm.geoData.longitude + ' @ ' + vm.geoData.speed + ' mph.');
    }

    // Async data binding
    $scope.$apply(apply());
  };

  // On Platform ready
  $ionicPlatform.ready(function() {
    $scope.interval = setInterval(function() {
      GeoServices.checkLocation(callback);
    }, heartbeat);


  });

  // On View enter
  $scope.$on('$ionicView.enter', function(e) {
    clearInterval($scope.interval);

    $scope.interval = setInterval(function() {
      GeoServices.checkLocation(callback);
    }, heartbeat);
  });
}
