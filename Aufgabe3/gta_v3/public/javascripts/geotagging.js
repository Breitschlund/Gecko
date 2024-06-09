// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");



/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */

var updateLocation = function() {

    var mapElement = document.getElementById('map');
    var geoTags = JSON.parse(mapElement.getAttribute('data-tags') || '[]');

    var latitudeAlex = document.getElementById('latitude');
    var longitudeAlex = document.getElementById('longitude');

    if (!document.getElementById('latitude') || document.getElementById('longitude')) {

        LocationHelper.findLocation(   function (location) {
    
            document.longitudeAlex.value = location.latitude;
            document.longitudeAlex.value = location.longitude;

            document.getElementById('search_latitude').value = location.latitude;
            document.getElementById('search_longitude').value = location.longitude;
        
            var map = new MapManager();
            map.initMap(location.latitude, location.longitude);
            map.updateMarkers(location.latitude, location.longitude);

            var mapViewImage = document.getElementById('mapView');
            if (mapViewImage) {
                mapViewImage.remove();
            }


            var mapViewLabel = document.querySelector('.discovery__map span');
            if (mapViewLabel) {
            mapViewLabel.remove();
            }
        }
   );
                
    } else {
        var latitude = parseFloat(latitudeAlex.value)
        var longitude = parseFloat(longitudeAlex.value)

        var map = new MapManager();
        map.initMap(latitude, longitude);
        map.updateMarkers(latitude, longitude, geoTags);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});