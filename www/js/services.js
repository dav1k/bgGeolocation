angular
  .module('services', [])
  .factory('GeoServices', GeoServices);

function GeoServices() {
  console.log('GeoServices loaded.');

  var location = {};

  // Expose interface
  return {
    checkLocation: checkLocation,
    getPosition: getPosition
  };

  function checkLocation(callback) {
    console.log('GeoServices: checkLocation called.');

    var options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    };

    // Navigator error
    function callError(error) {
      location.GPSEnabled = false;

      if (error.code == 1) {
        console.log('Location services are disabled.');
        location.GPSEnabled = false;
      } else if (error.code == 2) {
        console.error('GeoServices cannot determine location.', error);
      } else if (error.code == 3) {
        console.error('GeoServices timed out.', error);
      } else {
        console.error('GeoServices encountered an unknown error', error);
      }

      // Execute callback
      callback();
    }

    // Navigator successful
    function callPosition(position) {
      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        speed: position.coords.speed,
        GPSEnabled: true
      };

      // Execute callback
      callback();
    }

    // Where are we?? Find me!
    navigator.geolocation.getCurrentPosition(callPosition, callError, options);

  }

  function getPosition() {
    return location;
  }
}
