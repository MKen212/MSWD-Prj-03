"use strict";

// Get the HTML elements to manipulate
// Form Fields
const form = document.querySelector(".form-data");
const region = document.querySelector(".region-name");
const apiKey = document.querySelector(".api-key");

// Results
const loading = document.querySelector(".loading");
const errors = document.querySelector(".errors");
const results = document.querySelector(".result-container");
const myRegion = document.querySelector(".my-region");
const usage = document.querySelector(".carbon-usage");
const fossilFuel = document.querySelector(".fossil-fuel");
const clearBtn = document.querySelector(".clear-btn");

// Add submit event listener to form
form.addEventListener("submit", (event) => handleSubmit(event));

// Add click event listener to reset button
clearBtn.addEventListener("click", (event) => reset(event));

// Initialise Function
function init() {
  // Get anything in local storage
  const storedApiKey = localStorage.getItem("apiKey");  // Not usual to store API Key
  const storedRegion = localStorage.getItem("regionName");

  // Set icon to be generic green
  //TODO

  if (storedApiKey === null || storedRegion === null) {
    // If we don't have the keys then show the form & hide the other blocks
    form.style.display = "block";
    loading.style.display = "none";
    errors.textContent = "";
    results.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    // If we have saved keys/region then use them to get and show the results
    getCarbonUsage(storedApiKey, storedRegion);
    form.style.display = "none";
    results.style.display = "block";
    clearBtn.style.display = "block";
  }
}

// Function to clear the stored region & re-initialise the form
function reset(event) {
  event.preventDefault();
  localStorage.removeItem("regionName");
  init();
}

// Function to handle the form submission
function handleSubmit(event) {
  event.preventDefault();
  // Set Local Storage with entered data
  localStorage.setItem("apiKey", apiKey.value);
  localStorage.setItem("regionName", region.value);
  // Show the Loading div
  loading.style.display = "block";
  errors.textContent = "";
  // Get and show results
  getCarbonUsage(apiKey.value, region.value);
  form.style.display = "none";
  results.style.display = "block";
  clearBtn.style.display = "block";
}


function getCarbonUsage(apiKey, region) {

}

// Start the app
init();



