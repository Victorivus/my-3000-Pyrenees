const tableBody = document.querySelector("#peaks-table tbody");

// Load the peaks into the table
peaks.forEach((peak, index) => {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${peak.name}</td>
    <td>${peak.height}</td>
    <td>${peak.lat}</td>
    <td>${peak.lng}</td>
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
