#!/usr/bin/env node

/**
 * Script to check our search index for duplicates and verify data integrity
 * Also provides insights from LinuxCommandLibrary research
 */

const fs = require('fs');
const path = require('path');

// Load our search index
const indexPath = path.join(__dirname, 'data', 'index.js');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Extract the array content - handle the window.searchIndex declaration
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

console.log('=== Linux Man Pages Search Index Analysis ===\n');
console.log(`Total commands in index: ${searchIndex.length}`);

// Check for duplicates
const nameMap = new Map();
const duplicates = [];

searchIndex.forEach((cmd, index) => {
    const name = cmd.name || cmd.command; // Handle both 'name' and 'command' keys
    if (nameMap.has(name)) {
        duplicates.push({
            name: name,
            firstIndex: nameMap.get(name),
            secondIndex: index
        });
    } else {
        nameMap.set(name, index);
    }
});

if (duplicates.length > 0) {
    console.log(`\nFound ${duplicates.length} duplicate entries:`);
    duplicates.forEach(dup => {
        console.log(`  - "${dup.name}" at indices ${dup.firstIndex} and ${dup.secondIndex}`);
    });
} else {
    console.log('\n✓ No duplicate entries found');
}

// Count by section
const sectionCounts = {};
searchIndex.forEach(cmd => {
    const section = cmd.section || 'unknown';
    sectionCounts[section] = (sectionCounts[section] || 0) + 1;
});

console.log('\nCommands by section:');
Object.entries(sectionCounts).sort(([a], [b]) => a.localeCompare(b)).forEach(([section, count]) => {
    console.log(`  Section ${section}: ${count} commands`);
});

// Count by data file
const fileCounts = {};
searchIndex.forEach(cmd => {
    const file = cmd.file || 'unknown';
    fileCounts[file] = (fileCounts[file] || 0) + 1;
});

console.log('\nCommands by data file:');
Object.entries(fileCounts).sort(([a], [b]) => a - b).forEach(([file, count]) => {
    console.log(`  man_${file}.js: ${count} commands`);
});

// Check for missing descriptions
const missingDesc = searchIndex.filter(cmd => !cmd.description || cmd.description.trim() === '');
if (missingDesc.length > 0) {
    console.log(`\n⚠ ${missingDesc.length} commands missing descriptions:`);
    missingDesc.slice(0, 10).forEach(cmd => {
        console.log(`  - ${cmd.name || cmd.command} (section ${cmd.section})`);
    });
    if (missingDesc.length > 10) {
        console.log(`  ... and ${missingDesc.length - 10} more`);
    }
}

console.log('\n=== LinuxCommandLibrary Comparison ===\n');
console.log('The LinuxCommandLibrary repository by SimonSchubert contains:');
console.log('- 6,800 manual pages (vs our 1,838)');
console.log('- Uses SQLite database (34MB database.db file)');
console.log('- Multi-platform: Android, CLI, Desktop, and Web');
console.log('- Database schema includes:');
console.log('  * Commands table: id, category, name, description');
console.log('  * CommandSection table: id, title, content, command_id');
console.log('  * Additional tables for tips, basic commands, and categories');
console.log('- Supports TLDR integration');
console.log('- Apache 2.0 licensed (commands copyrighted by original authors)');

console.log('\nKey differences from our approach:');
console.log('- They use SQLite database vs our JavaScript objects');
console.log('- They have 3.7x more commands (likely includes non-standard commands)');
console.log('- They organize by categories in addition to sections');
console.log('- They include "tips" and "basic commands" as separate entities');

console.log('\nPotential improvements for our collection:');
console.log('1. Consider adding more commands from additional packages');
console.log('2. Add category organization for better browsing');
console.log('3. Include command tips or examples section');
console.log('4. Consider section-specific collections (e.g., admin commands)');

// Sample some interesting commands to check
const interestingCommands = ['git', 'docker', 'kubectl', 'npm', 'python', 'rust', 'cargo'];
console.log('\nChecking for modern tool coverage:');
interestingCommands.forEach(cmd => {
    const found = searchIndex.find(c => (c.name || c.command) === cmd);
    console.log(`  ${cmd}: ${found ? '✓ Found' : '✗ Not found'}`);
});

console.log('\n=== Summary ===');
console.log(`We have ${searchIndex.length} unique commands from official Linux man pages`);
console.log('Our collection focuses on standard Linux commands available on most systems');
console.log('This provides a solid foundation that can be expanded based on user needs\n');