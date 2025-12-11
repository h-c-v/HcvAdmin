const fs = require('fs');
const path = './src/data/mock-data.ts';
let content = fs.readFileSync(path, 'utf8');

// Add id to vehicles
let vehicleId = 1;
content = content.replace(/(\n\s+\{)\n(\s+clientId:)/g, (match, p1, p2) => {
  return `${p1}\n    id: '${vehicleId++}',\n${p2}`;
});

// Add id to services  
let serviceId = 1;
content = content.replace(/(\n\s+\{)\n(\s+workshopId:)/g, (match, p1, p2) => {
  return `${p1}\n    id: '${serviceId++}',\n${p2}`;
});

fs.writeFileSync(path, content);
console.log('Fixed IDs in mock-data.ts');
