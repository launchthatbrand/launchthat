const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

// Create the scripts directory if it doesn't exist
const scriptsDir = path.resolve(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Define icon sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Define icon directory
const iconDir = path.resolve(__dirname, "../public/icons");
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Generate icons
sizes.forEach((size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Fill background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);

  // Add text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${size / 4}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("WSA", size / 2, size / 2);

  // Save the image
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(iconDir, `icon-${size}x${size}.png`), buffer);

  console.log(`Generated icon-${size}x${size}.png`);
});

console.log("All icons generated successfully!");
