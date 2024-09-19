document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-btn');
    const importButton = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file');

    // Function to download peaks data as JSON
    saveButton.addEventListener('click', () => {
        const dataStr = JSON.stringify(peaks, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'peaks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Show file input when import button is clicked
    importButton.addEventListener('click', () => {
        importFileInput.click();  // Trigger file input dialog
    });

    // Handle file selection and import
    importFileInput.addEventListener('change', () => {
        const file = importFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    if (Array.isArray(data)) {
                        peaks = data;  // Update the global peaks variable
                        // Save to localStorage
                        localStorage.setItem("peaks", JSON.stringify(peaks));
                        document.dispatchEvent(new Event('peaksLoaded'));   // Reload the table with new data
                    } else {
                        alert('Invalid file format. The file must contain a JSON array.');
                    }
                } catch (e) {
                    alert('Error reading file. Please make sure it is a valid JSON file.');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please select a file to import.');
        }
    });
});
