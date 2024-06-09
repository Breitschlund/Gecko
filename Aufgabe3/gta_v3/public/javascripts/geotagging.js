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

    LocationHelper.findLocation(   function (location) {
    
        document.getElementById('latitude').value = location.latitude;
        document.getElementById('longitude').value = location.longitude;

        document.getElementById('search_latitude').value = location.latitude;
        document.getElementById('search_longitude').value = location.longitude;
        
        var map = new MapManager();
        map.initMap(location.latitude, location.longitude);
        map.updateMarkers(location.latitude, location.longitude);

        var mapViewImage = document.getElementById('mapView');
        mapViewImage.remove();

        var mapViewLabel = document.querySelector('.discovery__map span');
        mapViewLabel.remove();
        
    }
   );
                
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});