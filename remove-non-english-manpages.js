#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

// Main function to remove non-English pages
async function removeNonEnglishPages() {
    const report = loadReport();
    createBackup();
    
    console.log(`\nMoving ${report.pages.length} non-English man pages to backup...\n`);
    
    const stats = {
        moved: 0,
        kept: 0,
        failed: 0
    };
    
    // Pages to keep (might be intentionally non-English)
    const keepPatterns = [
        /^iso[-_]8859[-_]/,  // Character encoding pages
        /^cp\d+$/,           // Code page encodings
        /^tis-620$/,         // Thai encoding
        /^utf-8$/,           // UTF-8 encoding
        /^locale/,           // Locale pages
        /^charsets/,         // Character set pages
    ];
    
    for (let i = 0; i < report.pages.length; i++) {
        const page = report.pages[i];
        const match = page.file.match(/^(.+?)\.(\d+.*)\.txt$/);
        
        if (!match) {
            stats.failed++;
            continue;
        }
        
        const [, command] = match;
        
        // Check if we should keep this page
        const shouldKeep = keepPatterns.some(pattern => pattern.test(command));
        
        if (shouldKeep) {
            stats.kept++;
            continue;
        }
        
        // Move to backup
        const sourcePath = path.join(MAN_PAGES_DIR, page.file);
        const backupPath = path.join(BACKUP_DIR, page.file);
        
        try {
            if (fs.existsSync(sourcePath)) {
                fs.renameSync(sourcePath, backupPath);
                stats.moved++;
            }
        } catch (error) {
            console.error(`Failed to move ${page.file}: ${error.message}`);
            stats.failed++;
        }
        
        // Progress indicator
        if ((i + 1) % 100 === 0) {
            process.stdout.write(`\rProcessed ${i + 1}/${report.pages.length} pages...`);
        }
    }
    
    console.log('\n\n=== REMOVAL COMPLETE ===\n');
    console.log(`Moved to backup: ${stats.moved}`);
    console.log(`Kept (encoding pages): ${stats.kept}`);
    console.log(`Failed: ${stats.failed}`);
    
    const remainingFiles = fs.readdirSync(MAN_PAGES_DIR).filter(f => f.endsWith('.txt'));
    console.log(`\nRemaining man pages: ${remainingFiles.length}`);
    
    console.log(`\nOriginal files backed up to: ${BACKUP_DIR}`);
    console.log('\nNext steps:');
    console.log('1. Run "node extract-options.js" to update the search index');
    console.log('2. To restore: node remove-non-english-manpages.js --restore');
}

// Restore from backup
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
            
            fs.renameSync(backupPath, targetPath);
            restored++;
        } catch (error) {
            console.error(`Failed to restore ${file}: ${error.message}`);
        }
    }
    
    console.log(`Restored ${restored} files.`);
    
    // Clean up backup directory
    try {
        fs.rmdirSync(BACKUP_DIR);
        console.log('Removed backup directory.');
    } catch (e) {
        // Directory might not be empty
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args[0] === '--restore') {
        restoreFromBackup();
    } else {
        removeNonEnglishPages().catch(console.error);
    }
}