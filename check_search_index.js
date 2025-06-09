const fs = require('fs');
const vm = require('vm');

// Read the index.js file
const indexContent = fs.readFileSync('data/index.js', 'utf8');

// Create a context to evaluate the file
const context = { window: {} };
vm.createContext(context);
vm.runInContext(indexContent, context);

const searchIndex = context.window.searchIndex;

console.log(`Total entries: ${searchIndex.length}`);

// Check for entries with missing properties
let missingCommand = 0;
let missingDescription = 0;
let missingSection = 0;
let missingFile = 0;

const problematicEntries = [];

searchIndex.forEach((entry, index) => {
    const problems = [];
    
    if (!entry.command) {
        missingCommand++;
        problems.push('missing command');
    }
    if (!entry.description && entry.description !== '') {
        missingDescription++;
        problems.push('missing description');
    }
    if (!entry.section && entry.section !== 0) {
        missingSection++;
        problems.push('missing section');
    }
    if (!entry.file && entry.file !== 0) {
        missingFile++;
        problems.push('missing file');
    }
    
    if (problems.length > 0) {
        problematicEntries.push({
            index,
            entry,
            problems
        });
    }
});

console.log(`\nMissing properties:`);
console.log(`  - Missing command: ${missingCommand}`);
console.log(`  - Missing description: ${missingDescription}`);
console.log(`  - Missing section: ${missingSection}`);
console.log(`  - Missing file: ${missingFile}`);

if (problematicEntries.length > 0) {
    console.log(`\nProblematic entries (first 10):`);
    problematicEntries.slice(0, 10).forEach(({ index, entry, problems }) => {
        console.log(`  Index ${index}: ${JSON.stringify(entry)}`);
        console.log(`    Problems: ${problems.join(', ')}`);
    });
}

// Check for duplicate commands
const commandCounts = {};
searchIndex.forEach(entry => {
    if (entry.command) {
        const key = `${entry.command}_${entry.section}`;
        commandCounts[key] = (commandCounts[key] || 0) + 1;
    }
});

const duplicates = Object.entries(commandCounts).filter(([_, count]) => count > 1);
if (duplicates.length > 0) {
    console.log(`\nDuplicate commands (first 10):`);
    duplicates.slice(0, 10).forEach(([key, count]) => {
        console.log(`  ${key}: ${count} occurrences`);
    });
}