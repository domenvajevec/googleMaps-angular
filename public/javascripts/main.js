var app = angular.module('wfl', [])

.controller('LocationController', ['$scope', 'FoodLocLink', 'GeoCode', function($scope, FoodLocLink, GeoCode){
  $scope.zip = 91335;
  $scope.restaurants = [];
  $scope.priceSelection = 4;

  $scope.findPlaces = function(){
    GeoCode.codeAddress($scope.zip, function(result, status){
      console.log(result, "codeAddress");
      if (result){
        FoodLocLink.initialize(result, function(res, status){
          if (res){
            // console.log(res, "results from cb");
            $scope.restaurants = res;
            console.log($scope.restaurants);
          } else {
            console.log(status);
          }
            // FoodLocLink.getRestaurants(function(rest, status){
            //   console.log("in rest", rest);
            //   $scope.restaurants = rest;
            // });
            
        });
      } else {
        console.log(status);
      }
    });
  };
  $scope.filterRestaurants = function(){
    $scope.restaurants = $scope.restaurants.filter(function(r){
      return r.price_level <= $scope.priceSelection;
    });
  };
  
  $scope.$watch('restaurants',$scope.findPlaces(), true);
  // $scope.$watch(function(){
  //   return $scope.restaurants;
  //   }, $scope.findPlaces());

  // $scope.watch('price', function())
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
  // function initialize() {
  //   geocoder = new google.maps.Geocoder();
  //   var latlng = new google.maps.LatLng(-34.397, 150.644);
  //   var mapOptions = {
  //     zoom: 8,
  //     center: latlng
  //   };
  //   map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  // }

  function codeAddress(zip, cb) {
    var address = zip.toString();
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //console.log(results[0].geometry.location);
        return cb(results[0].geometry.location, status);
        // map.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: results[0].geometry.location
        // });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
  return {
    codeAddress: codeAddress
  };
});

// app.directive('googleMap', function(){

// });
// .factory('MapFactory', function(){
//   var geocoder;
//   var map;

//   function initialize() {
//     geocoder = new google.maps.Geocoder();
//     var latlng = new google.maps.LatLng(37.775, -122.419);
//     var mapOptions = {
//       zoom: 13,
//       center: latlng
//     };
//     map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
//   }

//   function codeAddress(zip) {

//     var address = zip.toString();
//     geocoder.geocode( { 'address': address}, function(results, status) {
//       if (status == google.maps.GeocoderStatus.OK) {
//         map.setCenter(results[0].geometry.location);
//         var marker = new google.maps.Marker({
//             map: map,
//             position: results[0].geometry.location
//         });
//       } else {
//         alert("Geocode was not successful for the following reason: " + status);
//       }
//     });
//   }

//   return {
//     initialize: initialize,
//     codeAddress: codeAddress
//   };
// })

  