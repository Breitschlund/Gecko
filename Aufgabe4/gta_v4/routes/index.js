// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

const store = new GeoTagStore();

router.get('/api/geotags/search', function(req, res) {  // sollte ohne search sein Fehler?
  const {searchterm, latitude, longitude} = req.query;

  if (latitude && longitude) {

      if (searchterm) {
        result = store.searchNearbyGeoTags(latitude, longitude, 100, searchterm);  // Normale Suche
      } else {
        result = store.getNearbyGeoTags(latitude, longitude, 100); // Leere Suche
      }

  } else {
      result = store.getNearbyGeoTags(0, 0, Infinity);  // Wenn etwas fehlt alles zurückgeben
  }

  res.json(result); // Status Code?
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', function(req, res) {
  const {name, latitude, longitude, hashtag} = req.body;
  const newTag = new GeoTag(name, latitude, longitude, hashtag);
  store.addGeoTag(newTag);
  res.json(newTag); // Status Code?
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const tag = store.getGeoTagById(id);
  if (tag) {
      res.json(tag); // Status Code?
  } else {
      res.status(404).json({ message: "GeoTag not found" });
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const newTag = req.body;
  const tag = store.updateGeoTag(id, newTag);
  if (tag) {
      res.json(tag); // Status Code?
  } else {
      res.status(404).json({ message: "GeoTag not found" });
  }
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const tag = store.getGeoTagById(id);
  if (tag) {
      store.removeGeoTag(id);
      res.json(tag); // Status Code?
  } else {
      res.status(404).json({ message: "GeoTag not found" });
  }
});

module.exports = router;
