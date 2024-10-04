const tableBody = document.querySelector("#peaks-table tbody");

document.addEventListener('peaksLoaded', () => {
    loadTable();
});

if (peaks) {
    loadTable();  // Call the function immediately if peaks is already loaded
}

function loadTable() {
    // Group peaks by 'zone'
    const peaksByZone = peaks.reduce((acc, peak) => {
        if (peak.zone !== 'Unknown') {
            if (!acc[peak.zone]) {
                acc[peak.zone] = [];
            }
            acc[peak.zone].push(peak);
        }
        return acc;
    }, {});

    // Clear existing table body content
    const tableBody = document.querySelector('#peaks-table tbody');
    tableBody.innerHTML = ''; 

    // Iterate over each zone group
    for (const [zone, peaks] of Object.entries(peaksByZone)) {
      // Create a table row for the zone header
      const zoneRow = document.createElement('tr');
      zoneRow.innerHTML = `
          <td colspan="6" class="zone-header">${zone}</td>
      `;
      zoneRow.classList.add('zone-row');  // Optional: Add class for styling
      tableBody.appendChild(zoneRow);
  
      // Iterate through each peak in the zone
      peaks.forEach((peak, index) => {
          const row = document.createElement("tr");
          
          // Add class 'main-peak' if category is 'main', and 'removed-peak' if status is 'Removed'
          if (peak.category === "main") {
              row.classList.add("main-peak");
          }
          if (peak.status === "Removed") {
              row.classList.add("removed-peak");
          }
  
          row.innerHTML = `
              <td>${peak.name}</td>
              <td class="height-cell">${peak.elevation}
                  <table class="height-details">
                      <tr><th>Source</th><th>Height</th></tr>
                      ${peak.ele_buyse_gps ? `<tr><td>Original list / GPS</td><td>${peak.ele_buyse_gps}</td></tr>` : ''}
                      ${peak.ele_sitar_icc ? `<tr><td>SITAR/ICC</td><td>${peak.ele_sitar_icc}</td></tr>` : ''}
                      ${peak.ele_ign ? `<tr><td>IGN</td><td>${peak.ele_ign}</td></tr>` : ''}
                      ${peak.prominence ? `<tr><td>Prominence</td><td>${peak.prominence}</td></tr>` : ''}
                  </table>
              </td>
              <!-- <td>${peak.latitude}</td> -->
              <!-- <td>${peak.longitude}</td> -->
              <td>
                  <span class="list-version">${peak.status}</span>
              </td>
              <td>
                  <span class="climbed-status">${peak.climbed ? 'Yes' : 'No'}</span>
              </td>
              <td>
                  <input type="date" class="ascent-date" value="${peak.date || ''}">
              </td>
              <td>
                  <button class="toggle-ascent" data-index="${index}">
                      ${peak.climbed ? 'Unlog Ascent' : 'Log Ascent'}
                  </button>
              </td>
          `;
          tableBody.appendChild(row);
      });
    }
}


// Event listener to handle toggling the ascent
tableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("toggle-ascent")) {
    const index = event.target.getAttribute("data-index");
    const dateInput = event.target.closest("tr").querySelector(".ascent-date").value;

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

    // Update the status in the table
    const statusCell = event.target.closest("tr").querySelector(".climbed-status");
    statusCell.textContent = peaks[index].climbed ? 'Yes' : 'No';
    
    // Update button text
    event.target.textContent = peaks[index].climbed ? 'Unlog Ascent' : 'Log Ascent';

    // Save to localStorage
    localStorage.setItem("peaks", JSON.stringify(peaks));
  }
});

// Load saved data from localStorage if available
const savedPeaks = JSON.parse(localStorage.getItem("peaks"));
if (savedPeaks) {
  savedPeaks.forEach((savedPeak, index) => {
    peaks[index].climbed = savedPeak.climbed;
    peaks[index].date = savedPeak.date;
  });
}
