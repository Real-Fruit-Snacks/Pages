#!/usr/bin/env node

/**
 * Extract command options from man pages
 * This script processes man page files and extracts option information
 * to build a comprehensive options database for the command explainer.
 */

const fs = require('fs');
const path = require('path');

// Output file for the options database
const OUTPUT_FILE = 'data/options.js';

// Regular expressions for parsing options
const OPTION_PATTERNS = {
    // Matches: -a, --all    description (description on same line)
    shortLongWithDesc: /^\s*(-\w)(?:,\s*(--[\w-]+))?\s+(.+)/,
    // Matches: -a, --all (description on next line)
    shortLongNoDesc: /^\s*(-\w)(?:,\s*(--[\w-]+))?\s*$/,
    // Matches: --option    description
    longOnlyWithDesc: /^\s*(--[\w-]+)\s+(.+)/,
    // Matches: --option (description on next line)
    longOnlyNoDesc: /^\s*(--[\w-]+)\s*$/,
    // Matches: -abc    combined short options
    shortOnly: /^\s*(-\w+)\s+(.+)/,
    // Matches option with argument: -f FILE, --file=FILE
    withArg: /^\s*(-\w|--[\w-]+)(?:\s+|=)([A-Z]+)\s+(.+)/,
    // Matches description continuation line (heavy indentation)
    descriptionLine: /^\s{10,}(.+)/
};

// Common section headers that contain options
const OPTION_SECTIONS = ['OPTIONS', 'DESCRIPTION', 'COMMAND OPTIONS', 'ARGUMENTS'];

/**
 * Extract options from a man page file
 */
function extractOptionsFromManPage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const command = path.basename(filePath).split('.')[0];
    
    const options = {};
    let inOptionsSection = false;
    let currentOption = null;
    let currentDescription = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if we're entering an options section
        if (OPTION_SECTIONS.some(section => line.trim().toUpperCase() === section)) {
            inOptionsSection = true;
            continue;
        }
        
        // Check if we're leaving the options section
        if (inOptionsSection && /^[A-Z][A-Z\s]+$/.test(line.trim()) && line.trim().length > 2) {
            // New section header, save current option and exit
            if (currentOption) {
                saveOption(options, currentOption, currentDescription.join(' '));
            }
            inOptionsSection = false;
            continue;
        }
        
        if (!inOptionsSection) continue;
        
        // Try to match option patterns
        let matched = false;
        
        // Check for short and long option format with description on same line
        const shortLongWithDescMatch = line.match(OPTION_PATTERNS.shortLongWithDesc);
        if (shortLongWithDescMatch) {
            // Save previous option
            if (currentOption) {
                saveOption(options, currentOption, currentDescription.join(' '));
            }
            
            currentOption = {
                short: shortLongWithDescMatch[1],
                long: shortLongWithDescMatch[2] || null
            };
            currentDescription = [shortLongWithDescMatch[3].trim()];
            matched = true;
        }
        
        // Check for short and long option format with description on next line
        if (!matched) {
            const shortLongNoDescMatch = line.match(OPTION_PATTERNS.shortLongNoDesc);
            if (shortLongNoDescMatch) {
                // Save previous option
                if (currentOption) {
                    saveOption(options, currentOption, currentDescription.join(' '));
                }
                
                currentOption = {
                    short: shortLongNoDescMatch[1],
                    long: shortLongNoDescMatch[2] || null
                };
                currentDescription = [];
                matched = true;
            }
        }
        
        // Check for long option only with description
        if (!matched) {
            const longWithDescMatch = line.match(OPTION_PATTERNS.longOnlyWithDesc);
            if (longWithDescMatch) {
                if (currentOption) {
                    saveOption(options, currentOption, currentDescription.join(' '));
                }
                
                currentOption = {
                    short: null,
                    long: longWithDescMatch[1]
                };
                currentDescription = [longWithDescMatch[2].trim()];
                matched = true;
            }
        }
        
        // Check for long option only without description
        if (!matched) {
            const longNoDescMatch = line.match(OPTION_PATTERNS.longOnlyNoDesc);
            if (longNoDescMatch) {
                if (currentOption) {
                    saveOption(options, currentOption, currentDescription.join(' '));
                }
                
                currentOption = {
                    short: null,
                    long: longNoDescMatch[1]
                };
                currentDescription = [];
                matched = true;
            }
        }
        
        // Check for short option only
        if (!matched) {
            const shortMatch = line.match(OPTION_PATTERNS.shortOnly);
            if (shortMatch && shortMatch[1].length === 2) { // Single short option
                if (currentOption) {
                    saveOption(options, currentOption, currentDescription.join(' '));
                }
                
                currentOption = {
                    short: shortMatch[1],
                    long: null
                };
                currentDescription = [shortMatch[2].trim()];
                matched = true;
            }
        }
        
        // Check for description continuation line (heavily indented)
        if (!matched && currentOption) {
            const descMatch = line.match(OPTION_PATTERNS.descriptionLine);
            if (descMatch) {
                currentDescription.push(descMatch[1].trim());
                matched = true;
            }
        }
        
        // Skip empty lines or unmatched lines when we have a current option
        if (!matched && currentOption && line.trim() === '') {
            // Skip empty lines between option and description
            matched = true;
        }
    }
    
    // Save last option
    if (currentOption) {
        saveOption(options, currentOption, currentDescription.join(' '));
    }
    
    return { command, options };
}

/**
 * Save option to the options object
 */
function saveOption(options, optionInfo, description) {
    const key = optionInfo.short || optionInfo.long;
    if (!key) return;
    
    const optionData = {
        description: cleanDescription(description),
        argType: detectArgType(description)
    };
    
    if (optionInfo.long && optionInfo.short) {
        optionData.long = optionInfo.long;
    }
    
    options[key] = optionData;
}

/**
 * Clean up description text
 */
function cleanDescription(description) {
    return description
        .replace(/\s+/g, ' ')
        .replace(/^\s+|\s+$/g, '')
        .replace(/\.$/, '');
}

/**
 * Detect if option requires an argument
 */
function detectArgType(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('requires') || desc.includes('specify') || desc.includes('set')) {
        return 'required';
    }
    
    if (desc.includes('optional') || desc.includes('may be')) {
        return 'optional';
    }
    
    return 'none';
}

/**
 * Process all man pages and generate options database
 */
function processAllManPages() {
    const manPagesDir = path.join(__dirname, 'man_pages');
    const files = fs.readdirSync(manPagesDir);
    
    const commandOptions = {};
    let processedCount = 0;
    
    console.log(`Processing ${files.length} man page files...`);
    
    // Process only command man pages (section 1 and 8)
    const commandFiles = files.filter(f => f.match(/\.(1|8)\.txt$/));
    
    for (const file of commandFiles) {
        try {
            const filePath = path.join(manPagesDir, file);
            const result = extractOptionsFromManPage(filePath);
            
            if (Object.keys(result.options).length > 0) {
                commandOptions[result.command] = {
                    description: getCommandDescription(result.command),
                    options: result.options
                };
                processedCount++;
                
                if (processedCount % 100 === 0) {
                    console.log(`Processed ${processedCount} commands...`);
                }
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }
    
    console.log(`\nExtracted options for ${processedCount} commands`);
    
    // Generate JavaScript file
    generateOptionsFile(commandOptions);
}

/**
 * Get command description from search index
 */
function getCommandDescription(command) {
    // This would normally read from data/index.js
    // For now, return a placeholder
    return `${command} command`;
}

/**
 * Generate the options JavaScript file
 */
function generateOptionsFile(commandOptions) {
    const output = `// Auto-generated command options database
// Generated on ${new Date().toISOString()}
// Total commands: ${Object.keys(commandOptions).length}

window.commandOptions = ${JSON.stringify(commandOptions, null, 2)};
`;
    
    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`\nOptions database written to ${OUTPUT_FILE}`);
    console.log(`File size: ${(output.length / 1024).toFixed(2)} KB`);
}

// Run the extraction
if (require.main === module) {
    processAllManPages();
}

module.exports = { extractOptionsFromManPage };