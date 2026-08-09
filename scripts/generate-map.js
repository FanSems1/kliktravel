const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const d3Geo = require('d3-geo');

// We load the 50m resolution world atlas map data
const world = require('world-atlas/countries-50m.json');

// Find the Indonesia feature (country code 360)
const countries = topojson.feature(world, world.objects.countries);
const indonesia = countries.features.find(f => f.id === "360");

if (!indonesia) {
  console.error("Indonesia feature not found in dataset!");
  process.exit(1);
}

// Setup a projection centered on Indonesia (centered around 118°E and -2.5°S)
// Fit to a standard 1200x600 viewBox for wide screen landscape mapping
const projection = d3Geo.geoMercator()
  .center([118, -2.5])
  .scale(1300)
  .translate([600, 300]);

const pathGenerator = d3Geo.geoPath().projection(projection);
const svgPath = pathGenerator(indonesia);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="100%" height="100%">
  <path d="${svgPath}" fill="currentColor" stroke="none" />
</svg>`;

// Ensure directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'indonesia.svg'), svgContent);
console.log("Successfully generated public/indonesia.svg");
