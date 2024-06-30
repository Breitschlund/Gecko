// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

var map;            // aus updateLocation herausgezogen um es unten zu verwenden
var taglist = [];

/**
 * Function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
var updateLocation = function() {
    const mapElement = document.getElementById("map");
    const taglistJson = mapElement.getAttribute("data-tags");
    taglist = JSON.parse(taglistJson);

    if (document.getElementById('latitude').value == "" || document.getElementById('longitude').value == "") {
        LocationHelper.findLocation(function(location) {
            document.getElementById('latitude').value = location.latitude;
            document.getElementById('longitude').value = location.longitude;
            document.getElementById('search_latitude').value = location.latitude;
            document.getElementById('search_longitude').value = location.longitude;

            map = new MapManager();
            map.initMap(location.latitude, location.longitude);
            console.log("map initialized");
            map.updateMarkers(location.latitude, location.longitude, taglist);

            removeMapViewElements();
        });
    } else {
        var latitude = parseFloat(document.getElementById('latitude').value);
        var longitude = parseFloat(document.getElementById('longitude').value);

        document.getElementById('search_latitude').value = latitude;
        document.getElementById('search_longitude').value = longitude;

        map = new MapManager();
        map.initMap(latitude, longitude);
        console.log("map initialized");
        map.updateMarkers(latitude, longitude, taglist);

        removeMapViewElements();
    }
};

function removeMapViewElements() {
    var mapViewImage = document.getElementById('mapView');
    if (mapViewImage) {
        mapViewImage.remove();
    }

    var mapViewLabel = document.querySelector('.discovery__map span');
    if (mapViewLabel) {
        mapViewLabel.remove();
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();

    document.getElementById('tag-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            latitude: formData.get('latitude'),
            longitude: formData.get('longitude'),
            hashtag: formData.get('hashtag')
        };

        fetch('/api/geotags', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(newTag => {
            console.log('Success:', newTag);
            taglist.push(newTag);
            map.updateMarkers(parseFloat(newTag.latitude), parseFloat(newTag.longitude), taglist);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    document.getElementById('discoveryFilterForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        const queryParams = new URLSearchParams({
            searchterm: formData.get('searchterm'),
            latitude: parseFloat(formData.get('latitude')),
            longitude: parseFloat(formData.get('longitude'))
        });

        fetch(`/api/geotags?${queryParams.toString()}`)
        .then(response => response.json())
        .then(data => {
            console.log('Search Results:', data);
            taglist = data;
            updateTagList(taglist);
            map.updateMarkers(parseFloat(formData.get('latitude')), parseFloat(formData.get('longitude')), taglist);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    function updateTagList(tags) {
        const tagListElement = document.getElementById('discoveryResults');
        tagListElement.innerHTML = '';
        tags.forEach(tag => {
            const listItem = document.createElement('li');
            listItem.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`;
            tagListElement.appendChild(listItem);
        });
    }
});