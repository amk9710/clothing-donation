// Set up the Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1rOTcxMCIsImEiOiJjbGc1cWRtNTIwNWl0M2VuNW9yZTJxYmJ2In0.BR49nDMsJOC3F0VxtVqT9Q';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-73.9712, 40.7831],
  zoom: 11
});

// Add navigation controls to map
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
  map.addSource('parks', {
    type: 'geojson',
    data: 'data/ParksProperties.geojson'
  })

  map.addLayer({
    id: 'parks',
    type: 'fill',
    source: 'parks',
    paint: {
      'fill-color': [
        'match',
        ['get', 'jurisdiction'],
        'DPR',
        '#317338',
        'DOE',
        '#f57058',
        'NYCHA',
        '#072ef0',
        'DPR/DOE',
        '#b258c4',
        /* other */ '#ccc'
      ]
    }
  })

  // Add legend to map
  var legendItems = [{ label: 'DPR', color: '#317338' }, { label: 'DOE', color: '#f57058' }, { label: 'NYCHA', color: '#072ef0' }, { label: 'DPR/DOE', color: '#b258c4' }, { label: 'Other', color: '#ccc' }];

  var legend = document.getElementById('legend');

  legendItems.forEach(function (item) {
    var div = document.createElement('div');
    div.className = 'legend-item';
    var marker = document.createElement('div');
    marker.className = 'legend-marker';
    marker.style.backgroundColor = item.color;
    var label = document.createElement('div');
    label.innerHTML = item.label;
    div.appendChild(marker);
    div.appendChild(label);
    legend.appendChild(div);
  });

  // Add popup to parks layer
  map.on('click', 'parks', function (e) {
    var popupContent = '<div class="popup-content">' +
      '<h3>' + e.features[0].properties.name311 + '</h3>' +
      '<p>' + e.features[0].properties.acres + ' acres</p>' +
      '</div>';
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(popupContent)
      .addTo(map);
  });

  // Change cursor to pointer when hovering over parks layer
  map.on('mouseenter', 'parks', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'parks', function () {
    map.getCanvas().style.cursor = '';
  });
});
