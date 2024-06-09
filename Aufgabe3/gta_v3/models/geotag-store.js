// File origin: VS1LAB A3

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    // TODO: ... your code here ...
    constructor() {
        this.geoTags = [];
        GeoTagExamples.tagList.forEach(tag => this.addGeoTag(new GeoTag(tag[0], tag[1], tag[2], tag[3])));
    }

    addGeoTag(geoTag){
        this.geoTags.push(geoTag);
    }

    removeGeoTag(name){
        this.geoTags = this.geoTags.filter(geoTag => geoTag.name !== name);

    }

    getNearbyGeoTags(latitude, longitude, radius){
        return this.geoTags.filter(geoTag => {
            const distance = Math.sqrt(Math.pow(geoTag.latitude - latitude, 2) + Math.pow(geoTag.longitude - longitude, 2));
            return distance <= radius;
        });
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword){
        return this.getNearbyGeoTags(latitude, longitude, radius).filter(tag => {
            return tag.name.toLowerCase().includes(keyword.toLowerCase()) || tag.hashtag.toLowerCase().includes(keyword.toLowerCase());
        });
    }



}

module.exports = InMemoryGeoTagStore
