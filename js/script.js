$(document).ready(function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/amk9710/clhmt6ral00cw01pfajgb1576',
    center: [-73.9712, 40.7831],
    zoom: 9.5
  });

  let currentFilter = null;
  let allMarkersShowing = false;
  let selectedMarker = null;

  map.on('load', function () {
    map.addSource('my-points', {
      type: 'geojson',
      data: 'data/my-points.geojson'
    });

    map.addLayer({
      id: 'circle-my-points',
      type: 'circle',
      source: 'my-points',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          10, 6,
          18, 14
        ],
        'circle-opacity': 0.7,
        'circle-color': [
          'match',
          ['get', 'Type'],
          'Donate', '#33a02c',
          'Recycle', '#ff7f00',
          'Sell', '#e31a1c',
          '#808080'
        ]
      }
    });


    map.on('click', 'circle-my-points', function (e) {
      var properties = e.features[0].properties;
      var coordinates = e.features[0].geometry.coordinates;

      showProperties(properties);

      if (selectedMarker) {
        map.setFeatureState({ source: 'my-points', id: selectedMarker }, { selected: false });
      }

      selectedMarker = e.features[0].id;
      map.setFeatureState({ source: 'my-points', id: selectedMarker }, { selected: true });

      map.flyTo({
        center: coordinates,
        zoom: 14
      });
    });

    map.on('mouseenter', 'circle-my-points', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'circle-my-points', function () {
      map.getCanvas().style.cursor = '';
    });

    function showProperties(properties) {
      // Clear the previous properties
      $('#sidebar #content').empty();
    
      var name = properties['Name'];
      var nameElement = $('<p>').addClass('property').css('font-weight', 'bold');
      var link = properties['Link'];
      if (link) {
        var linkIcon = $('<i>').addClass('fas fa-link').css('color', '#1f78b4').css('font-size', '20px');
        var linkAnchor = $('<a>').attr('href', link).attr('target', '_blank').append(linkIcon);
        var linkWrapper = $('<span>').addClass('link-wrapper').append(linkAnchor).css('margin-right', '15px');
        nameElement.append(linkWrapper);
      }
      nameElement.append(name);
      $('#sidebar #content').append(nameElement);
    
      var address = properties['Address'];
      if (address) {
        var addressIcon = $('<i>').addClass('fas fa-map-marker-alt').css('color', '#1f78b4').css('font-size', '20px').css('margin-right', '15px');
        var addressLink = $('<a>').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address)).attr('target', '_blank').append(addressIcon);
        var addressElement = $('<p>').addClass('property').append(addressLink).append(address);
        $('#sidebar #content').append(addressElement);
      }
        
      
      
      var openingHours = properties['Dropoff'];
      if (openingHours) {
        var openingHoursElement = $('<p>').addClass('property').text('Dropoff Time: ' + openingHours);
        $('#sidebar #content').append(openingHoursElement);
      }

      var collectionDetails = properties['Collection Details'];
      if (collectionDetails) {
        var collectionDetailsElement = $('<p>').addClass('property').text('Collected Items: ' + collectionDetails);
        $('#sidebar #content').append(collectionDetailsElement);
      }
    }

    $('#showDonationButton').on('click', function () {
      filterPoints('Donate');
      updateActiveButton('#showDonationButton');
    });

    $('#showRecycleButton').on('click', function () {
      filterPoints('Recycle');
      updateActiveButton('#showRecycleButton');
    });

    $('#showSellButton').on('click', function () {
      filterPoints('Sell');
      updateActiveButton('#showSellButton');
    });

    $('#showAllButton').on('click', function () {
      showAllMarkers();
    });

    function updateActiveButton(buttonId) {
      $('.filter-button').removeClass('active');
      $(buttonId).addClass('active');
    }

    function filterPoints(type) {
      if (type === currentFilter) {
        return;
      }

      map.setFilter('circle-my-points', ['==', ['get', 'Type'], type]);
      currentFilter = type;
      updateShowAllButtonVisibility();
    }

    function showAllMarkers() {
      map.setFilter('circle-my-points', null);
      currentFilter = null;
      updateShowAllButtonVisibility();
    }

    function updateShowAllButtonVisibility() {
      allMarkersShowing = (currentFilter === null);
      if (allMarkersShowing) {
        $('#showAllButton').hide();
        $('.filter-button').removeClass('active');
      } else {
        $('#showAllButton').show();
      }
    }

    // Hide the showAllButton initially
    $('#showAllButton').hide();

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: {
        color: '#444444', // Dark gray marker color
        draggable: false // Disable marker dragging
      },
      countries: 'us',
      placeholder: 'Search for an address',
      proximity: {
        longitude: -74.0060, // NYC longitude
        latitude: 40.7128 // NYC latitude
      },
      bbox: [-74.2557, 40.4957, -73.6895, 40.9156] // NYC bounding box
    });



    var geocoderContainer = $('<div>').addClass('geocoder-container');
    $('#map').append(geocoderContainer);
    geocoderContainer.append(geocoder.onAdd(map));


    geocoder.on('result', function (e) {
      if (!allMarkersShowing) {
        showAllMarkers();
      }
      var properties = e.result.properties;
      showProperties(properties);
    });
  });
});
