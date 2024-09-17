// Initialize the map (assuming you're using Leaflet)
const map = L.map('map').setView([42.7, 0.5], 9); // Centered in the Pyrenees
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Add markers for each peak
peaks.forEach((peak, index) => {
  const marker = L.marker([peak.lat, peak.lng], {
    icon: L.icon({
      iconUrl: peak.climbed ? 'green-marker-icon.png' : 'red-marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
  }).addTo(map);

  // Add a popup to log/unlog ascent from the map
  marker.bindPopup(`
    <strong>${peak.name}</strong><br>
    Height: ${peak.height}m<br>
    Climbed: ${peak.climbed ? 'Yes' : 'No'}<br>
    <input type="date" id="ascent-date-${index}" value="${peak.date || ''}">
    <br>
    <button onclick="toggleAscent(${index})">
      ${peak.climbed ? 'Unlog Ascent' : 'Log Ascent'}
    </button>
  `);
});

// Function to toggle ascent directly from map popup
function toggleAscent(index) {
  const dateInput = document.querySelector(`#ascent-date-${index}`).value;

  if (peaks[index].climbed) {
    // Unlog ascent
    peaks[index].climbed = false;
    peaks[index].date = null;
  } else {
    // Log ascent
    if (dateInput) {
      peaks[index].climbed = true;
      peaks[index].date = dateInput;
    } else {
      alert("Please select a date.");
      return;
    }
  }

  // Update localStorage
  localStorage.setItem("peaks", JSON.stringify(peaks));

  // Refresh the marker icon to green or red
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.setIcon(
        L.icon({
          iconUrl: peaks[index].climbed ? 'green-marker-icon.png' : 'red-marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    }
  });
}
