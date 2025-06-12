#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MAN_PAGES_DIR = path.join(__dirname, 'man_pages');
const BACKUP_DIR = path.join(__dirname, 'man_pages_non_english_backup');
const REPORT_FILE = path.join(__dirname, 'non-english-manpages.json');

// Load the non-English pages report
function loadReport() {
    if (!fs.existsSync(REPORT_FILE)) {
        console.error('Error: non-english-manpages.json not found. Run detect-non-english-manpages.js first.');
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
}

// Create backup directory
function createBackup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        console.log(`Created backup directory: ${BACKUP_DIR}`);
    }
}

// Try to get English version from system
function getEnglishManPage(command, section) {
    try {
        // Force English locale
        const env = { ...process.env, LANG: 'C', LC_ALL: 'C' };
        
        // Try to get the man page in English
        let manContent;
        
        // First, try using man with explicit section
        try {
            manContent = execSync(`LANG=C LC_ALL=C man ${section} ${command} 2>/dev/null | col -bx`, 
                { encoding: 'utf8', env });
        } catch (e) {
            // Try without section
            manContent = execSync(`LANG=C LC_ALL=C man ${command} 2>/dev/null | col -bx`, 
                { encoding: 'utf8', env });
        }
        
        // Check if we got English content
        if (manContent && manContent.includes('NAME') && manContent.includes('SYNOPSIS')) {
            return manContent;
        }
        
        return null;
    } catch (error) {
        return null;
    }
}

// Try to find English man page from system files
function findSystemManPage(command, section) {
    const searchPaths = [
        `/usr/share/man/man${section}/${command}.${section}.gz`,
        `/usr/share/man/en/man${section}/${command}.${section}.gz`,
        `/usr/local/share/man/man${section}/${command}.${section}.gz`,
        `/usr/share/man/man${section}/${command}.${section}`,
        `/usr/share/man/en/man${section}/${command}.${section}`,
        `/usr/local/share/man/man${section}/${command}.${section}`
    ];
    
    for (const searchPath of searchPaths) {
        if (fs.existsSync(searchPath)) {
            try {
                let content;
                if (searchPath.endsWith('.gz')) {
                    content = execSync(`zcat ${searchPath} | LANG=C LC_ALL=C man -l - 2>/dev/null | col -bx`, 
                        { encoding: 'utf8' });
                } else {
                    content = execSync(`LANG=C LC_ALL=C man -l ${searchPath} 2>/dev/null | col -bx`, 
                        { encoding: 'utf8' });
                }
                
                if (content && content.includes('NAME')) {
                    return content;
                }
            } catch (e) {
                // Continue to next path
            }
        }
    }
    
    return null;
}

// Delete non-English pages that we can't replace
function deleteNonEnglishPages(pages) {
    const deleteList = [];
    
    for (const page of pages) {
        const match = page.file.match(/^(.+?)\.(\d+.*)\.txt$/);
        if (!match) continue;
        
        const [, command, section] = match;
        
        // Some pages we should definitely remove
        const shouldDelete = [
            // Perl module documentation in other languages
            /^POD2::/,
            // Character encoding pages that might be intentionally non-English
            /^iso[-_]8859[-_]/,
            /^cp\d+$/,
            /^tis-620$/,
            // Other known non-English documentation
            /::JA::/,  // Japanese Perl docs
        ];
        
        const keepPage = shouldDelete.some(pattern => pattern.test(command));
        
        if (!keepPage) {
            // Move to backup
            const sourcePath = path.join(MAN_PAGES_DIR, page.file);
            const backupPath = path.join(BACKUP_DIR, page.file);
            
            try {
                fs.renameSync(sourcePath, backupPath);
                deleteList.push(page.file);
            } catch (e) {
                console.error(`Failed to move ${page.file}: ${e.message}`);
            }
        }
    }
    
    return deleteList;
}

// Main replacement function
async function replaceNonEnglishPages() {
    const report = loadReport();
    createBackup();
    
    console.log(`\nProcessing ${report.pages.length} non-English man pages...\n`);
    
    const stats = {
        replaced: 0,
        deleted: 0,
        failed: 0,
        kept: 0
    };
    
    const replacements = [];
    const deletions = [];
    const failures = [];
    
    // Process each non-English page
    for (let i = 0; i < report.pages.length; i++) {
        const page = report.pages[i];
        const match = page.file.match(/^(.+?)\.(\d+.*)\.txt$/);
        
        if (!match) {
            console.error(`Invalid filename format: ${page.file}`);
            failures.push(page.file);
            stats.failed++;
            continue;
        }
        
        const [, command, section] = match;
        const sectionNum = section.match(/^\d+/)?.[0] || section;
        
        // Progress indicator
        if ((i + 1) % 100 === 0) {
            process.stdout.write(`\rProcessing ${i + 1}/${report.pages.length} pages...`);
        }
        
        // Skip certain files that might be intentionally non-English
        if (command.includes('::JA::') || command.match(/^iso[-_]8859[-_]/) || 
            command === 'tis-620' || command.match(/^cp\d+$/)) {
            stats.kept++;
            continue;
        }
        
        // Try to get English version
        let englishContent = getEnglishManPage(command, sectionNum);
        
        if (!englishContent) {
            englishContent = findSystemManPage(command, sectionNum);
        }
        
        if (englishContent) {
            // Backup original
            const sourcePath = path.join(MAN_PAGES_DIR, page.file);
            const backupPath = path.join(BACKUP_DIR, page.file);
            
            try {
                // Move original to backup
                fs.renameSync(sourcePath, backupPath);
                
                // Write English version
                fs.writeFileSync(sourcePath, englishContent);
                
                replacements.push({
                    file: page.file,
                    command,
                    section,
                    originalLanguage: page.language
                });
                stats.replaced++;
            } catch (error) {
                console.error(`\nError replacing ${page.file}: ${error.message}`);
                failures.push(page.file);
                stats.failed++;
            }
        } else {
            // Move to backup if we can't find English version
            const sourcePath = path.join(MAN_PAGES_DIR, page.file);
            const backupPath = path.join(BACKUP_DIR, page.file);
            
            try {
                fs.renameSync(sourcePath, backupPath);
                deletions.push({
                    file: page.file,
                    command,
                    section,
                    originalLanguage: page.language
                });
                stats.deleted++;
            } catch (error) {
                console.error(`\nError moving ${page.file}: ${error.message}`);
                failures.push(page.file);
                stats.failed++;
            }
        }
    }
    
    console.log('\n\n=== REPLACEMENT COMPLETE ===\n');
    console.log(`Replaced with English: ${stats.replaced}`);
    console.log(`Moved to backup: ${stats.deleted}`);
    console.log(`Kept as-is: ${stats.kept}`);
    console.log(`Failed: ${stats.failed}`);
    
    // Save replacement report
    const replacementReport = {
        timestamp: new Date().toISOString(),
        stats,
        replacements: replacements.slice(0, 100),  // First 100
        deletions: deletions.slice(0, 100),        // First 100
        failures
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'replacement-report.json'),
        JSON.stringify(replacementReport, null, 2)
    );
    
    console.log('\nDetailed report saved to: replacement-report.json');
    console.log(`\nOriginal files backed up to: ${BACKUP_DIR}`);
    
    if (stats.replaced > 0 || stats.deleted > 0) {
        console.log('\nNext steps:');
        console.log('1. Run "node extract-options.js" to update the search index');
        console.log('2. Test the application to ensure man pages display correctly');
        console.log('3. If needed, restore from backup directory');
    }
}

// Restore from backup function
function restoreFromBackup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        console.error('No backup directory found.');
        return;
    }
    
    const backupFiles = fs.readdirSync(BACKUP_DIR);
    console.log(`Restoring ${backupFiles.length} files from backup...`);
    
    let restored = 0;
    for (const file of backupFiles) {
        try {
            const backupPath = path.join(BACKUP_DIR, file);
            const targetPath = path.join(MAN_PAGES_DIR, file);
            
            // Remove English version if it exists
            if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
            }
            
            // Restore original
            fs.renameSync(backupPath, targetPath);
            restored++;
        } catch (error) {
            console.error(`Failed to restore ${file}: ${error.message}`);
        }
    }
    
    console.log(`Restored ${restored} files.`);
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args[0] === '--restore') {
        restoreFromBackup();
    } else {
        replaceNonEnglishPages().catch(console.error);
    }
}

module.exports = { replaceNonEnglishPages, restoreFromBackup };