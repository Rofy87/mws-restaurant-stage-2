
/**
 * Common database helper functions.
 */

class DBHelper {

 static DBOpen() {
    return idb.open('mws', 1, upgradeDb => {
      if (!upgradeDb.objectStoreNames.contains('restaurants')) {
        upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
      } 
    })
  }

  static checkData(){
    return DBHelper.DBOpen().then(db=> {

      var transaction = db.transaction('restaurants', 'readonly');
      var objectStore = transaction.objectStore('restaurants');
      var countRequest = objectStore.count(); 
       return objectStore.getAll();
    });
  }

  static setData(items){
    return DBHelper.DBOpen().then(db => {
      var transaction = db.transaction(['restaurants'], 'readwrite');
      var objectStore = transaction.objectStore('restaurants');

      objectStore.put(items);
      return transaction.complete;
    });
    
  }
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }


  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    DBHelper.checkData().then(restaurants => {
      if(restaurants.length > 0){
        callback(null, restaurants);
        return;
      }
      fetch(DBHelper.DATABASE_URL)
      .then(function(response) {
        return response.json()
      }).then(function(json) {
          const restaurants = json;
          callback(null, restaurants);
          restaurants.forEach(
            restaurant => DBHelper.setData(restaurant).then(function(){
            }).catch(function(ex) {
              console.log('Adding Data failed', ex)
              const error = (`Adding Data failed.`);
              callback(error, null);
            }));  
      }).catch(function(ex) {
        console.log('parsing failed', ex)
        const error = (`Request failed.`);
        callback(error, null);
      });  
    }).catch(ex => {
      console.log('Checking data failed', ex);
      const error = (`Checking data failed`);
      callback(error, null)
    }) ;
    
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
  
    return restaurant.id;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
