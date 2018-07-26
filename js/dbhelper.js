"use strict";var _createClass=function(){function a(n,t){for(var e=0;e<t.length;e++){var a=t[e];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(n,a.key,a)}}return function(n,t,e){return t&&a(n.prototype,t),e&&a(n,e),n}}();function _classCallCheck(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}var DBHelper=function(){function i(){_classCallCheck(this,i)}return _createClass(i,null,[{key:"DBOpen",value:function(){return idb.open("mws",1,function(n){n.objectStoreNames.contains("restaurants")||n.createObjectStore("restaurants",{keyPath:"id"})})}},{key:"checkData",value:function(){return i.DBOpen().then(function(n){var t=n.transaction("restaurants","readonly").objectStore("restaurants");t.count();return t.getAll()})}},{key:"setData",value:function(e){return i.DBOpen().then(function(n){var t=n.transaction(["restaurants"],"readwrite");return t.objectStore("restaurants").put(e),t.complete})}},{key:"fetchRestaurants",value:function(e){i.checkData().then(function(n){0<n.length?e(null,n):fetch(i.DATABASE_URL).then(function(n){return n.json()}).then(function(n){var t=n;e(null,t),t.forEach(function(n){return i.setData(n).then(function(){}).catch(function(n){console.log("Adding Data failed",n);e("Adding Data failed.",null)})})}).catch(function(n){console.log("parsing failed",n);e("Request failed.",null)})}).catch(function(n){console.log("Checking data failed",n);e("Checking data failed",null)})}},{key:"fetchRestaurantById",value:function(a,r){i.fetchRestaurants(function(n,t){if(n)r(n,null);else{var e=t.find(function(n){return n.id==a});e?r(null,e):r("Restaurant does not exist",null)}})}},{key:"fetchRestaurantByCuisine",value:function(a,r){i.fetchRestaurants(function(n,t){if(n)r(n,null);else{var e=t.filter(function(n){return n.cuisine_type==a});r(null,e)}})}},{key:"fetchRestaurantByNeighborhood",value:function(a,r){i.fetchRestaurants(function(n,t){if(n)r(n,null);else{var e=t.filter(function(n){return n.neighborhood==a});r(null,e)}})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(a,r,u){i.fetchRestaurants(function(n,t){if(n)u(n,null);else{var e=t;"all"!=a&&(e=e.filter(function(n){return n.cuisine_type==a})),"all"!=r&&(e=e.filter(function(n){return n.neighborhood==r})),u(null,e)}})}},{key:"fetchNeighborhoods",value:function(r){i.fetchRestaurants(function(n,e){if(n)r(n,null);else{var a=e.map(function(n,t){return e[t].neighborhood}),t=a.filter(function(n,t){return a.indexOf(n)==t});r(null,t)}})}},{key:"fetchCuisines",value:function(r){i.fetchRestaurants(function(n,e){if(n)r(n,null);else{var a=e.map(function(n,t){return e[t].cuisine_type}),t=a.filter(function(n,t){return a.indexOf(n)==t});r(null,t)}})}},{key:"urlForRestaurant",value:function(n){return"./restaurant.html?id="+n.id}},{key:"imageUrlForRestaurant",value:function(n){return n.id}},{key:"mapMarkerForRestaurant",value:function(n,t){return new google.maps.Marker({position:n.latlng,title:n.name,url:i.urlForRestaurant(n),map:t,animation:google.maps.Animation.DROP})}},{key:"DATABASE_URL",get:function(){return"http://localhost:1337/restaurants"}}]),i}();