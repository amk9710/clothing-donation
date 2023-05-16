$(document).ready(function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/amk9710/clhmt6ral00cw01pfajgb1576',
    center: [-73.9712, 40.7831],
    zoom: 9.5
  });

  let currentFilter = null;

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
          10, 8,
          18, 16
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
      showProperties(properties);
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
    
      // Create and append the property elements
      var name = properties['Name'];
      var nameElement = $('<p>').addClass('property').text(name).css('font-weight', 'bold');
      $('#sidebar #content').append(nameElement);
    
      var openingHours = properties['Opening Hours'];
      if (openingHours) {
        var openingHoursElement = $('<p>').addClass('property').text('Opening Hours: ' + openingHours);
        $('#sidebar #content').append(openingHoursElement);
      }

      var collectionDetails = properties['Collection Details'];
      if (collectionDetails) {
        var collectionDetailsElement = $('<p>').addClass('property').text('Collection Details: ' + collectionDetails);
        $('#sidebar #content').append(collectionDetailsElement);
      }
    
      var address = properties['Address'];
      if (address) {
        var addressElement = $('<p>').addClass('property').html('Address: <a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address) + '" target="_blank">' + address + '</a>');
        $('#sidebar #content').append(addressElement);
      }
    
      var link = properties['Link'];
      if (link) {
        var linkElement = $('<p>').addClass('property').html(' <a href="' + link + '" target="_blank">' + link + '</a>');
        $('#sidebar #content').append(linkElement);
      }
    }
    

    $('#showDonationButton').on('click', function () {
      filterPoints('Donate');
    });

    $('#showRecycleButton').on('click', function () {
      filterPoints('Recycle');
    });

    $('#showSellButton').on('click', function () {
      filterPoints('Sell');
    });

    $('#clearFilterButton').on('click', function () {
      clearFilter();
    });

    function filterPoints(Type) {
      if (Type === currentFilter) return;
      currentFilter = Type;
      map.setFilter('circle-my-points', ['==', 'Type', Type]);
    }

    function clearFilter() {
      if (currentFilter !== null) {
        map.setFilter('circle-my-points', ['has', 'Type']);
        currentFilter = null;
      }
    }
  });
});
