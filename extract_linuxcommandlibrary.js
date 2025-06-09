#!/usr/bin/env node

/**
 * Script to extract all commands from LinuxCommandLibrary SQLite database
 * and convert them to our format
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Extracting commands from LinuxCommandLibrary database...\n');

// First, let's explore the database structure
console.log('Database schema:');
try {
    const schema = execSync('sqlite3 linuxcommandlibrary.db ".schema"', { encoding: 'utf8' });
    console.log(schema);
} catch (e) {
    console.error('Error reading schema:', e.message);
    process.exit(1);
}

// Count total commands
try {
    const count = execSync('sqlite3 linuxcommandlibrary.db "SELECT COUNT(*) FROM Command;"', { encoding: 'utf8' });
    console.log(`\nTotal commands in database: ${count.trim()}`);
} catch (e) {
    console.error('Error counting commands:', e.message);
}

// Extract all commands with their sections
console.log('\nExtracting commands and sections...');
const query = `
SELECT 
    c.name as command_name,
    c.description as command_desc,
    cs.title as section_title,
    cs.content as section_content,
    c.id as command_id
FROM Command c
LEFT JOIN CommandSection cs ON c.id = cs.command_id
ORDER BY c.name, cs.id;
`;

try {
    // Export to CSV for easier parsing
    execSync(`sqlite3 -csv linuxcommandlibrary.db "${query}" > commands_export.csv`);
    console.log('Exported commands to CSV file');
    
    // Read and parse the CSV
    const csvContent = fs.readFileSync('commands_export.csv', 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Group by command
    const commandMap = new Map();
    
    lines.forEach(line => {
        // Parse CSV line (handling quoted fields)
        const matches = line.match(/("([^"]*)"|[^,]*),("([^"]*)"|[^,]*),("([^"]*)"|[^,]*),("([^"]*)"|[^,]*),("([^"]*)"|[^,]*)/);
        if (!matches) return;
        
        const commandName = (matches[2] || matches[1] || '').trim();
        const commandDesc = (matches[4] || matches[3] || '').trim();
        const sectionTitle = (matches[6] || matches[5] || '').trim();
        const sectionContent = (matches[8] || matches[7] || '').trim();
        
        if (!commandName) return;
        
        if (!commandMap.has(commandName)) {
            commandMap.set(commandName, {
                name: commandName,
                description: commandDesc,
                sections: []
            });
        }
        
        if (sectionTitle && sectionContent) {
            commandMap.get(commandName).sections.push({
                title: sectionTitle,
                content: sectionContent
            });
        }
    });
    
    console.log(`\nExtracted ${commandMap.size} unique commands`);
    
    // Convert to our format
    const manData = {};
    const searchIndex = [];
    
    commandMap.forEach((cmdData, cmdName) => {
        // Determine section (default to 1 for user commands)
        let section = 1;
        
        // Build full man page content from sections
        let content = '';
        
        // Add NAME section
        content += `${cmdName.toUpperCase()}(${section})\n\n`;
        content += 'NAME\n';
        content += `       ${cmdName} - ${cmdData.description || 'Command description'}\n\n`;
        
        // Add other sections
        cmdData.sections.forEach(sec => {
            content += `${sec.title.toUpperCase()}\n`;
            // Format content with proper indentation
            const lines = sec.content.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    content += `       ${line}\n`;
                } else {
                    content += '\n';
                }
            });
            content += '\n';
        });
        
        // Add to our data structures
        const key = `${cmdName}_${section}`;
        manData[key] = {
            command: cmdName,
            section: section,
            description: cmdData.description || 'Command description',
            content: content
        };
        
        searchIndex.push({
            command: cmdName,
            section: section,
            description: cmdData.description || 'Command description',
            file: 1
        });
    });
    
    // Write the data files
    console.log('\nWriting data files...');
    
    // Write man data
    const manDataContent = `// Man page data - Generated from LinuxCommandLibrary
// This file contains manual page content from LinuxCommandLibrary (6,800+ commands)

window.manData_1 = ${JSON.stringify(manData, null, 2)};`;
    
    fs.writeFileSync(path.join(__dirname, 'data', 'man_1.js'), manDataContent);
    console.log('Written data/man_1.js');
    
    // Write search index
    const indexContent = `// Search index for all man pages
// Generated from LinuxCommandLibrary

window.searchIndex = ${JSON.stringify(searchIndex, null, 2)};`;
    
    fs.writeFileSync(path.join(__dirname, 'data', 'index.js'), indexContent);
    console.log('Written data/index.js');
    
    // Check file sizes
    const manSize = fs.statSync(path.join(__dirname, 'data', 'man_1.js')).size / (1024 * 1024);
    console.log(`\nFile sizes:`);
    console.log(`  man_1.js: ${manSize.toFixed(2)} MB`);
    
    // Clean up
    fs.unlinkSync('commands_export.csv');
    
    console.log('\nExtraction complete!');
    console.log(`Total commands: ${searchIndex.length}`);
    
} catch (e) {
    console.error('Error extracting commands:', e.message);
    process.exit(1);
}