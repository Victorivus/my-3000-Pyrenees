// Assuming the `peaks` array is already loaded (skip the definition here)
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
      <button class="log-ascent" data-index="${index}">Log Ascent</button>
    </td>
  `;

  tableBody.appendChild(row);
});

// Event listener to handle logging the ascent
tableBody.addEventListener("click", (event) => {
  if (event.target.classList.contains("log-ascent")) {
    const index = event.target.getAttribute("data-index");
    const dateInput = event.target.closest("tr").querySelector(".ascent-date").value;

    if (dateInput) {
      peaks[index].climbed = true;
      peaks[index].date = dateInput;

      // Update the status in the table
      event.target.closest("tr").querySelector(".climbed-status").textContent = "Yes";

      // Save to localStorage (to persist the data between views)
      localStorage.setItem("peaks", JSON.stringify(peaks));
    } else {
      alert("Please select a date.");
    }
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
