/* global chrome */
"use strict";

// Import axios as the HTTP request handler
import axios from "../node_modules/axios";

// Get Console Log Background Page
const bkg = chrome.extension.getBackgroundPage();

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

  // Populate the input text boxes with data if found
  region.value = storedRegion;
  apiKey.value = storedApiKey;

  // Use Chrome RunTime to set the icon colour to green
  chrome.runtime.sendMessage({
    action: "updateIcon",
    value: {
      colour: "green",
    },
  });

  if (storedApiKey === null || storedRegion === null) {
    // If we don't have the keys then show the form & hide the other blocks
    form.style.display = "block";
    loading.style.display = "none";
    errors.textContent = "";
    results.style.display = "none";
    clearBtn.style.display = "none";
  } else {
    // If we have saved keys/region then use them to get and show the results
    results.style.display = "block";
    form.style.display = "none";
    displayCarbonUsage(storedApiKey, storedRegion);
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
  clearBtn.style.display = "block";
  // Get and show results
  displayCarbonUsage(apiKey.value, region.value);
}

// Function to retrieve the Carbon Data for the region and display it
async function displayCarbonUsage(apiKey, region) {
  try {
    await axios
      .get("https://api.co2signal.com/v1/latest", {
        params: {
          countryCode: region,
        },
        headers: {
          "auth-token": apiKey,
        },
      })
      .then((response) => {
        bkg.console.log(response);
        if (!response.data.data.carbonIntensity) {
          // Throw an error if no data returned
          throw new Error("No Data!");
        }
        // Use the data
        let CO2Floor = Math.floor(response.data.data.carbonIntensity);
        let CO2Round = Math.round(response.data.data.carbonIntensity);
        let fossilPercent = response.data.data.fossilFuelPercentage.toFixed(2);

        // Update the Icon Colour based on CO2 data
        calculateColour(CO2Floor);

        // Update the results
        myRegion.textContent = region;
        usage.textContent = `${CO2Round} grams (CO2 emitted per kWh)`;
        fossilFuel.textContent = `${fossilPercent} % (%age of fossil fuels used to generate electricity)`;

        // Update the display
        form.style.display = "none";
        loading.style.display = "none";
        results.style.display = "block";
        clearBtn.style.display = "block";
      });
  } catch (error) {
    bkg.console.log(error);
    errors.textContent = "Sorry, we have no data for the region you requested";
    loading.style.display = "none";
    results.style.display = "none";
  }
}

// Function to calculate the colour of CO2 usage
function calculateColour(value) {
  let co2Scale = [0, 150, 600, 750, 800];
  let colours = ["#2AA364", "#F5EB4D", "#9E4229", "#381D02", "#381D02"];

  // Find closest number in co2Scale to value entered
  /* let closestNum = co2Scale.sort((a, b) => {
    return Math.abs(a - value) - Math.abs(b - value);
  })[0]; */
  let closestNum = co2Scale.reduce((a, b) => {
    return (Math.abs(b - value) < Math.abs (a - value) ? b : a);
  });
  // bkg.console.log(`${value} is closest to ${closestNum}`);
  
  // Find the index of the closestNum
  let num = (element) => element === closestNum;
  let scaleIndex = co2Scale.findIndex(num);

  // Get the colour for that index
  let closestColour = colours[scaleIndex];
  // bkg.console.log(scaleIndex, closestColour);

  // Use Chrome RunTime to update the icon colour
  chrome.runtime.sendMessage({
    action: "updateIcon",
    value: {
      colour: closestColour,
    },
  });
}

// Start the app
init();
