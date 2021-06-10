/* global chrome */
"use strict";

// Execute Background Events

// Get Console Log Background Page
const bkg = chrome.extension.getBackgroundPage();

// Add Chrome Listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "updateIcon") {
    chrome.browserAction.setIcon({
      imageData: drawIcon(msg.value)
    });
  }
});

// Borrowed from Energy Lollipop Extension
function drawIcon(value) {
  // bkg.console.log(value);

  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  context.beginPath();
  context.fillStyle = value.colour;
  context.arc(100, 100, 50, 0, 2 * Math.PI);
  context.fill();

  return context.getImageData(50, 50, 100, 100);
}
