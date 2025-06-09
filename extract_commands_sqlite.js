#!/usr/bin/env node

/**
 * Script to extract all commands from LinuxCommandLibrary SQLite database
 * using Node.js sqlite3 module
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

console.log('Extracting commands from LinuxCommandLibrary database...\n');

const db = new sqlite3.Database('linuxcommandlibrary.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
});

// First, let's see the schema
db.all("SELECT name, sql FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
        console.error('Error reading schema:', err);
        return;
    }
    
    console.log('Database tables:');
    tables.forEach(table => {
        console.log(`\n${table.name}:`);
        console.log(table.sql);
    });
    
    // Now extract the commands
    extractCommands();
});

function extractCommands() {
    console.log('\n\nExtracting commands...');
    
    // First get all commands
    db.all("SELECT * FROM Command ORDER BY name", (err, commands) => {
        if (err) {
            console.error('Error reading commands:', err);
            return;
        }
        
        console.log(`Found ${commands.length} commands`);
        
        // Create a map to store command data
        const commandMap = new Map();
        const processedCommands = new Set();
        let completed = 0;
        
        // For each command, get its sections
        commands.forEach(cmd => {
            commandMap.set(cmd.id, {
                name: cmd.name,
                description: cmd.description || '',
                category: cmd.category || 0,
                sections: []
            });
        });
        
        // Get all command sections
        db.all("SELECT * FROM CommandSection ORDER BY command_id, id", (err, sections) => {
            if (err) {
                console.error('Error reading sections:', err);
                return;
            }
            
            console.log(`Found ${sections.length} command sections`);
            
            // Add sections to their commands
            sections.forEach(section => {
                if (commandMap.has(section.command_id)) {
                    commandMap.get(section.command_id).sections.push({
                        title: section.title || '',
                        content: section.content || ''
                    });
                }
            });
            
            // Convert to our format
            console.log('\nConverting to our format...');
            const manData = {};
            const searchIndex = [];
            
            commandMap.forEach((cmdData, cmdId) => {
                // Skip if no name
                if (!cmdData.name) return;
                
                // Determine section (default to 1 for user commands)
                let section = 1;
                
                // Build full man page content
                let content = '';
                
                // Add header
                content += `${cmdData.name.toUpperCase()}(${section})\n\n`;
                
                // Add NAME section
                content += 'NAME\n';
                content += `       ${cmdData.name}`;
                if (cmdData.description) {
                    content += ` - ${cmdData.description}`;
                }
                content += '\n\n';
                
                // Add other sections
                cmdData.sections.forEach(sec => {
                    if (sec.title && sec.content) {
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
                    }
                });
                
                // Add to our data structures
                const key = `${cmdData.name}_${section}`;
                manData[key] = {
                    command: cmdData.name,
                    section: section,
                    description: cmdData.description || 'Linux command',
                    content: content
                };
                
                searchIndex.push({
                    command: cmdData.name,
                    section: section,
                    description: cmdData.description || 'Linux command',
                    file: 1
                });
            });
            
            // Write the data files
            console.log('\nWriting data files...');
            
            // Write man data
            const manDataContent = `// Man page data - Generated from LinuxCommandLibrary
// This file contains manual page content from LinuxCommandLibrary (${searchIndex.length} commands)
// Source: https://github.com/SimonSchubert/LinuxCommandLibrary

window.manData_1 = ${JSON.stringify(manData, null, 2)};`;
            
            fs.writeFileSync(path.join(__dirname, 'data', 'man_1.js'), manDataContent);
            console.log('Written data/man_1.js');
            
            // Write search index
            const indexContent = `// Search index for all man pages
// Generated from LinuxCommandLibrary (${searchIndex.length} commands)

window.searchIndex = ${JSON.stringify(searchIndex, null, 2)};`;
            
            fs.writeFileSync(path.join(__dirname, 'data', 'index.js'), indexContent);
            console.log('Written data/index.js');
            
            // Check file sizes
            const manSize = fs.statSync(path.join(__dirname, 'data', 'man_1.js')).size / (1024 * 1024);
            console.log(`\nFile sizes:`);
            console.log(`  man_1.js: ${manSize.toFixed(2)} MB`);
            
            console.log('\nExtraction complete!');
            console.log(`Total commands: ${searchIndex.length}`);
            
            // Update version and documentation
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            packageJson.version = '4.0.0';
            fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
            console.log('\nUpdated version to 4.0.0');
            
            db.close();
        });
    });
}