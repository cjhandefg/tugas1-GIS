document.addEventListener('DOMContentLoaded', function() {
  // Fetch and display existing markers
  fetch("/api/markers")
      .then(response => response.json())
      .then(markers => {
          markers.forEach(marker => {
              // Add marker to Leaflet Map
              const leafletMarker = L.marker([marker.latitude, marker.longitude]).addTo(leafletMap);
              leafletMarker.bindPopup(`<b>${marker.name}</b>`);
              leafletMarker.on('click', function() {
                  leafletMap.setView([marker.latitude, marker.longitude], 15);
              });

              // Add marker to Google Maps
              const googleMarker = new google.maps.Marker({
                  position: { 
                      lat: parseFloat(marker.latitude), 
                      lng: parseFloat(marker.longitude) 
                  },
                  map: googleMap,
                  title: marker.name
              });

              const infoWindow = new google.maps.InfoWindow({
                  content: `<b>${marker.name}</b>`
              });

              googleMarker.addListener("click", () => {
                  googleMap.setZoom(15);
                  googleMap.setCenter(googleMarker.getPosition());
                  infoWindow.open(googleMap, googleMarker);
              });
          });
      });

  // Fetch and display existing polygons
  fetch("/api/polygons")
      .then(response => response.json())
      .then(polygons => {
          polygons.forEach(polygon => {
              try {
                  const coords = JSON.parse(polygon.coordinates);

                  // Add polygon to Leaflet
                  const leafletPolygon = L.polygon(coords, { color: 'blue' }).addTo(leafletMap);
                  leafletPolygon.bindPopup('Existing Polygon');

                  // Add polygon to Google Maps
                  const googlePolygon = new google.maps.Polygon({
                      paths: coords.map(coord => ({ 
                          lat: coord[0], 
                          lng: coord[1] 
                      })),
                      strokeColor: '#0000FF',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      fillColor: '#0000FF',
                      fillOpacity: 0.35
                  });
                  googlePolygon.setMap(googleMap);
              } catch (error) {
                  console.error('Error parsing polygon coordinates:', error);
              }
          });
      });

  // Tambahkan event listener untuk marker
  document.getElementById("markerForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("markerName").value;
      const lat = parseFloat(document.getElementById("markerLat").value);
      const lng = parseFloat(document.getElementById("markerLng").value);

      fetch("/api/markers", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
          body: JSON.stringify({ name, latitude: lat, longitude: lng }),
      })
      .then((res) => res.json())
      .then((data) => {
          // Add marker to Leaflet Map
          const leafletMarker = L.marker([lat, lng]).addTo(leafletMap);
          leafletMarker.bindPopup(`<b>${name}</b>`);
          leafletMarker.on('click', function() {
              leafletMap.setView([lat, lng], 15);
          });

          // Add marker to Google Maps
          const googleMarker = new google.maps.Marker({
              position: { lat, lng },
              map: googleMap,
              title: name
          });

          const infoWindow = new google.maps.InfoWindow({
              content: `<b>${name}</b>`
          });

          googleMarker.addListener("click", () => {
              googleMap.setZoom(15);
              googleMap.setCenter(googleMarker.getPosition());
              infoWindow.open(googleMap, googleMarker);
          });

          alert("Marker ditambahkan!");
          // Reset form
          document.getElementById("markerName").value = '';
          document.getElementById("markerLat").value = '';
          document.getElementById("markerLng").value = '';
      });
  });

  // Tambahkan event listener untuk poligon
  document.getElementById("polygonForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const coords = JSON.parse(document.getElementById("polygonCoords").value);

      fetch("/api/polygons", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
          body: JSON.stringify({ coordinates: coords }),
      })
      .then((res) => res.json())
      .then((data) => {
          // Add polygon to Leaflet
          const leafletPolygon = L.polygon(coords, { color: 'blue' }).addTo(leafletMap);
          leafletPolygon.bindPopup('New Polygon');

          // Add polygon to Google Maps
          const googlePolygon = new google.maps.Polygon({
              paths: coords.map(coord => ({ 
                  lat: coord[0], 
                  lng: coord[1] 
              })),
              strokeColor: '#0000FF',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#0000FF',
              fillOpacity: 0.35
          });
          googlePolygon.setMap(googleMap);

          alert("Polygon ditambahkan!");
          // Reset form
          document.getElementById("polygonCoords").value = '';
      });
  });
});