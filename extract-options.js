#!/usr/bin/env node

/**
 * Improved extract command options from man pages
 * Handles gaps between flags and descriptions better
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
    // Matches: -abc (no description on same line)
    shortOnlyNoDesc: /^\s*(-\w+)\s*$/,
    // Matches option with argument: -f FILE, --file=FILE
    withArg: /^\s*(-\w|--[\w-]+)(?:\s+|=)([A-Z]+)\s+(.+)/,
    // Matches description line (indented at least 8 spaces more than option)
    descriptionLine: /^\s{8,}(\S.*)$/,
    // Matches any indented non-empty line
    indentedLine: /^(\s+)(.+)$/
};

// Common section headers that contain options
const OPTION_SECTIONS = ['OPTIONS', 'DESCRIPTION', 'COMMAND OPTIONS', 'ARGUMENTS', 'FLAGS'];

/**
 * Extract options from a man page file with better gap handling
 */
function extractOptionsFromManPage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const command = path.basename(filePath).split('.')[0];
    
    const options = {};
    let inOptionsSection = false;
    let currentOption = null;
    let currentDescription = [];
    let blankLineCount = 0;
    let optionIndent = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if we're entering an options section
        if (OPTION_SECTIONS.some(section => line.trim().toUpperCase() === section)) {
            inOptionsSection = true;
            continue;
        }
        
        // Check if we're leaving the options section (new major section)
        if (inOptionsSection && /^[A-Z][A-Z\s]+$/.test(line.trim()) && line.trim().length > 2 && !line.includes('-')) {
            // New section header, save current option and exit
            if (currentOption && (currentDescription.length > 0 || blankLineCount < 3)) {
                saveOption(options, currentOption, currentDescription.join(' '));
            }
            inOptionsSection = false;
            currentOption = null;
            continue;
        }
        
        if (!inOptionsSection) continue;
        
        // Track blank lines
        if (line.trim() === '') {
            blankLineCount++;
            // If we have too many blank lines, save the current option and reset
            if (blankLineCount > 2 && currentOption) {
                if (currentDescription.length > 0) {
                    saveOption(options, currentOption, currentDescription.join(' '));
                }
                currentOption = null;
                currentDescription = [];
            }
            continue;
        } else {
            blankLineCount = 0;
        }
        
        // Try to match option patterns
        let matched = false;
        
        // Check for any option pattern (with or without description)
        const patterns = [
            { pattern: OPTION_PATTERNS.shortLongWithDesc, hasDesc: true },
            { pattern: OPTION_PATTERNS.shortLongNoDesc, hasDesc: false },
            { pattern: OPTION_PATTERNS.longOnlyWithDesc, hasDesc: true },
            { pattern: OPTION_PATTERNS.longOnlyNoDesc, hasDesc: false },
            { pattern: OPTION_PATTERNS.shortOnly, hasDesc: true },
            { pattern: OPTION_PATTERNS.shortOnlyNoDesc, hasDesc: false }
        ];
        
        for (const { pattern, hasDesc } of patterns) {
            const match = line.match(pattern);
            if (match) {
                // Save previous option if exists
                if (currentOption && currentDescription.length > 0) {
                    saveOption(options, currentOption, currentDescription.join(' '));
                }
                
                // Get indentation level of this option
                const indentMatch = line.match(/^(\s*)/);
                optionIndent = indentMatch ? indentMatch[1].length : 0;
                
                currentOption = {
                    short: match[1] && match[1].startsWith('-') && match[1].length === 2 ? match[1] : null,
                    long: match[2] || (match[1] && match[1].startsWith('--') ? match[1] : null)
                };
                
                // If the short match is actually multiple options like -abc, just take the flag
                if (match[1] && match[1].length > 2 && !match[1].startsWith('--')) {
                    currentOption.short = match[1];
                }
                
                currentDescription = hasDesc && match[match.length - 1] ? [match[match.length - 1].trim()] : [];
                matched = true;
                break;
            }
        }
        
        // If not an option but we have a current option, check if it's a description
        if (!matched && currentOption) {
            const indentMatch = line.match(/^(\s*)(.+)$/);
            if (indentMatch) {
                const lineIndent = indentMatch[1].length;
                const text = indentMatch[2].trim();
                
                // Consider it a description if:
                // 1. It's indented more than the option line
                // 2. OR it's indented at least 8 spaces
                // 3. AND it doesn't look like a new option
                if ((lineIndent > optionIndent || lineIndent >= 8) && !text.match(/^\s*-/)) {
                    currentDescription.push(text);
                    matched = true;
                }
            }
        }
    }
    
    // Save last option
    if (currentOption && currentDescription.length > 0) {
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
 * Get command description from search index
 */
function getCommandDescription(command) {
    return `${command} command`;
}

/**
 * Process all man pages and generate options database
 */
function processAllManPages() {
    const manPagesDir = path.join(__dirname, 'man_pages');
    const files = fs.readdirSync(manPagesDir);
    
    const commandOptions = {};
    let processedCount = 0;
    let totalProcessed = 0;
    
    console.log(`Processing ${files.length} man page files...`);
    
    // Process only command man pages (section 1 and 8)
    const commandFiles = files.filter(f => f.match(/\.(1|8)\.txt$/));
    console.log(`Found ${commandFiles.length} command man pages (sections 1 and 8)`);
    
    for (const file of commandFiles) {
        try {
            totalProcessed++;
            const filePath = path.join(manPagesDir, file);
            const result = extractOptionsFromManPage(filePath);
            
            if (Object.keys(result.options).length > 0) {
                commandOptions[result.command] = {
                    description: getCommandDescription(result.command),
                    options: result.options
                };
                processedCount++;
                
                if (processedCount % 100 === 0) {
                    console.log(`Processed ${processedCount} commands with options (checked ${totalProcessed} files)...`);
                }
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }
    
    console.log(`\nExtracted options for ${processedCount} commands out of ${totalProcessed} processed files`);
    
    // Generate JavaScript file
    generateOptionsFile(commandOptions);
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