#!/usr/bin/env node

/**
 * Script to remove duplicate commands from our data files
 * Keeps the first occurrence of each duplicate
 */

const fs = require('fs');
const path = require('path');

// Load the search index
const indexPath = path.join(__dirname, 'data', 'index.js');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Extract the array content
const arrayMatch = indexContent.match(/window\.searchIndex\s*=\s*(\[[\s\S]*\]);/);
if (!arrayMatch) {
    console.error('Could not find searchIndex array in index.js');
    process.exit(1);
}

// Parse the array
let searchIndex;
try {
    searchIndex = eval(arrayMatch[1]);
} catch (e) {
    console.error('Error parsing searchIndex:', e);
    process.exit(1);
}

console.log(`Original count: ${searchIndex.length} commands`);

// Load the man data
const manDataPath = path.join(__dirname, 'data', 'man_1.js');
const manDataContent = fs.readFileSync(manDataPath, 'utf8');

// Extract the object content
const dataMatch = manDataContent.match(/window\.manData_1\s*=\s*({[\s\S]*});/);
if (!dataMatch) {
    console.error('Could not find manData_1 object in man_1.js');
    process.exit(1);
}

// Parse the object
let manData;
try {
    manData = eval('(' + dataMatch[1] + ')');
} catch (e) {
    console.error('Error parsing manData_1:', e);
    process.exit(1);
}

// Remove duplicates from search index
const seen = new Set();
const uniqueIndex = [];
const removedCommands = [];

searchIndex.forEach((cmd, index) => {
    const name = cmd.command || cmd.name;
    if (!seen.has(name)) {
        seen.add(name);
        uniqueIndex.push(cmd);
    } else {
        removedCommands.push({ name, index });
        console.log(`Removing duplicate: ${name} at index ${index}`);
    }
});

console.log(`\nRemoved ${searchIndex.length - uniqueIndex.length} duplicate entries from search index`);
console.log(`New count: ${uniqueIndex.length} commands`);

// Remove duplicates from man data
const uniqueManData = {};
for (const [key, value] of Object.entries(manData)) {
    const command = key.split('_')[0]; // Extract command name from key
    if (!uniqueManData.hasOwnProperty(key)) {
        uniqueManData[key] = value;
    }
}

// Write updated search index
const newIndexContent = `// Search index for all man pages
// Generated from official Linux man-pages project and system man pages

window.searchIndex = ${JSON.stringify(uniqueIndex, null, 2)};`;

fs.writeFileSync(indexPath, newIndexContent);
console.log('\nUpdated data/index.js');

// Write updated man data
const newManDataContent = `// Man page data - Generated from official Linux man-pages and system utilities
// This file contains the actual manual page content for all commands

window.manData_1 = ${JSON.stringify(uniqueManData, null, 2)};`;

fs.writeFileSync(manDataPath, newManDataContent);
console.log('Updated data/man_1.js');

console.log('\nDuplicate removal complete!');