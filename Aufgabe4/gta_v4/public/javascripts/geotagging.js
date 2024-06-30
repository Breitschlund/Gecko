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

    const mapElement = document.getElementById("map");
    const taglistJson = mapElement.getAttribute("data-tags");
    const taglist = JSON.parse(taglistJson);

    if (document.getElementById('latitude').value == "" || document.getElementById('longitude').value == "") {

        LocationHelper.findLocation(   function (location) {
            document.getElementById('latitude').value = location.latitude;
            document.getElementById('longitude').value = location.longitude;

            document.getElementById('search_latitude').value = location.latitude;
            document.getElementById('search_longitude').value = location.longitude;

            var map = new MapManager();
            map.initMap(location.latitude, location.longitude);
            map.updateMarkers(location.latitude, location.longitude, taglist);

        removeMap();
        }
   );
                
    } else {
        var latitude = parseFloat(document.getElementById('latitude').value)
        var longitude = parseFloat(document.getElementById('longitude').value)

        var map = new MapManager();
        map.initMap(latitude, longitude);
        map.updateMarkers(latitude, longitude, taglist);

        removeMap();
    }
}

function removeMap() {
    var mapImage = document.getElementById('mapView');
    if(mapImage) {
        mapImage.remove();
    }
    var mapLabel = document.querySelector('.discovery__map span')
    if(mapLabel) {
        mapLabel.remove();
    }
}



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});