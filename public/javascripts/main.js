var app = angular.module('wfl', [])

.controller('LocationController', ['$scope', 'FoodLocLink', 'GeoCode', function($scope, FoodLocLink, GeoCode){
  $scope.zip = "944 Market Street #8, San Francisco, CA 94102";
  // $scope.restaurants = [];
  $scope.priceSelection = 4;

  $scope.findPlaces = function(){
    // if ($scope.restaurants !== []){
    //   $scope.restaurants = [];
    // }
    // $scope.priceSelection = 2;
    GeoCode.codeAddress($scope.zip, function(result, status){
      if (result){
        FoodLocLink.initialize(result, function(res, status){
          if (res){
            $scope.restaurants = res;
          } else {
            console.log(status);
          }
        });
      } else {
        console.log(status);
      }
    });
  };
  $scope.filterByPrice = function(item){
    return item.price_level <= $scope.priceSelection;
  };

  $scope.$watch('restaurants',$scope.findPlaces(), false);
}])

.factory('FoodLocLink', function(){
  var map;
  var infowindow;
  var restaurants;

  function initialize(latLng, cb) {

    var newLoc = new google.maps.LatLng(latLng.k, latLng.D);

    map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: newLoc,
      zoom: 15
    });

    var request = {
      location: newLoc,
      radius: 1000,
      types: ['food','restaurant']
    };
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function(results, status) {
      restaurants = [];
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          restaurants.push(results[i]);
          createMarker(results[i]);
        }
      }
    cb(restaurants, "error getting coordinates");
    });
  }

  function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }
  function getRestaurants(cb){
    console.log("deep in rest");
    console.log(restaurants);
    return cb(restaurants);
  }
  return  {
    initialize: initialize
  };
})
.factory('GeoCode', function(){
  var geocoder;
  var map;

  function codeAddress(zip, cb) {
    var address = zip.toString();
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        return cb(results[0].geometry.location, status);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
  return {
    codeAddress: codeAddress
  };
});

  