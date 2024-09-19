// Initialize the map
const map = L.map('map').setView([42.7, 0.5], 9); // Centered in the Pyrenees
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Define paths to marker icons
const greenIcon = L.icon({
  iconUrl: 'img/green-marker-icon.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const redIcon = L.icon({
  iconUrl: 'img/red-marker-icon.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

// Store marker references
const markers = {};

// Add markers for each peak
peaks.forEach((peak, index) => {
  const marker = L.marker([peak.latitude, peak.longitude], {
    icon: peak.climbed ? greenIcon : redIcon,
  }).addTo(map);

  // Store marker reference
  markers[index] = marker;

  // Add a popup to log/unlog ascent from the map
  marker.bindPopup(`
    <strong>${peak.name}</strong><br>
    Height: ${peak.elevation}m<br>
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
    markers[index].setIcon(redIcon); // Update only the selected marker
  } else {
    // Log ascent
    if (dateInput) {
      peaks[index].climbed = true;
      peaks[index].date = dateInput;
      markers[index].setIcon(greenIcon); // Update only the selected marker
    } else {
      alert("Please select a date.");
      return;
    }
  }

  // Update localStorage
  localStorage.setItem("peaks", JSON.stringify(peaks));
}
