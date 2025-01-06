const pictureInput = document.getElementById("picture");
const pictureLabel = document.getElementById("pictureLabel");
const pincodeInput = document.getElementById("pincode");
const getLocationBtn = document.getElementById("getLocation");
const locationInfoDiv = document.getElementById("locationInfo");
const areaSelect = document.getElementById("areaSelect");
const updateLocationBtn = document.getElementById("updateLocation");
const pictureFeedback = document.getElementById("pictureFeedback");
const pincodeFeedback = document.getElementById("pincodeFeedback");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// Picture input validation
pictureInput.addEventListener("change", () => {
  const file = pictureInput.files[0];
  if (file) {
    pictureFeedback.textContent = "Picture uploaded successfully.";
    getLocationBtn.disabled = false;
  } else {
    pictureFeedback.textContent = "Please upload a picture.";
    getLocationBtn.disabled = true;
  }
});

// Pincode input validation
pincodeInput.addEventListener("input", () => {
  const pincode = pincodeInput.value;
  if (pincode.length === 6 && /^\d+$/.test(pincode)) {
    pincodeFeedback.textContent = "Valid pincode.";
    getLocationBtn.disabled = false;
  } else {
    pincodeFeedback.textContent = "Enter a valid 6-digit pincode.";
    getLocationBtn.disabled = true;
  }
});

// Get location by pincode
getLocationBtn.addEventListener("click", async () => {
  const pincode = pincodeInput.value;

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data[0].Status === "Success") {
      const locationName = data[0].PostOffice[0].District;
      const areas = data[0].PostOffice.map((office) => office.Name);

      // Update location info
      document.getElementById("locationName").textContent = locationName;

      // Populate area dropdown
      areaSelect.innerHTML = `<option value="">--Select Area--</option>`;
      areas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        areaSelect.appendChild(option);
      });

      // Show location details
      locationInfoDiv.classList.remove("hidden");
      pincodeFeedback.textContent = "";
      updateLocationBtn.disabled = true;
    } else {
      pincodeFeedback.textContent = "Invalid pincode.";
      locationInfoDiv.classList.add("hidden");
    }
  } catch (error) {
    console.error(error);
    pincodeFeedback.textContent = "Failed to fetch location. Try again.";
  }
});

// Enable update button when area is selected
areaSelect.addEventListener("change", () => {
  updateLocationBtn.disabled = areaSelect.value === "";
});

// Update location
updateLocationBtn.addEventListener("click", () => {
  const selectedArea = areaSelect.value;
  if (selectedArea) {
    showToast(`Location updated with area: ${selectedArea}`);
  }
});

// Show toast notification
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}
