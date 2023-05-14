
// Set up the Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/amk9710/clhmt6ral00cw01pfajgb1576',
  center: [-73.9712, 40.7831],
  zoom: 10
});

// Create a geocoder object to use in the search bar
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: true,
  placeholder: 'Search for an address',
  countries: 'us'
});

// Add the geocoder to the map
$('#sidebar').append(geocoder.onAdd(map));

// Add navigation controls to map
map.addControl(new mapboxgl.NavigationControl());

// Change cursor to pointer when hovering over parks layer
map.on('mouseenter', 'parks', function () {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'parks', function () {
  map.getCanvas().style.cursor = '';
});
