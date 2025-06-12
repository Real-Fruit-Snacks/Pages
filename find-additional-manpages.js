#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MAN_PAGES_DIR = path.join(__dirname, 'man_pages');
const TEMP_DIR = path.join(__dirname, 'temp_additional_man');

// Ensure directories exist
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Get list of existing man pages
function getExistingManPages() {
    const existing = new Set();
    const files = fs.readdirSync(MAN_PAGES_DIR);
    
    files.forEach(file => {
        const match = file.match(/^(.+?)\.(\d+.*)\.txt$/);
        if (match) {
            const [, command, section] = match;
            existing.add(`${command}.${section}`);
            // Also track just the command name
            existing.add(command);
        }
    });
    
    return existing;
}

// Get all available man pages from the system
function getSystemManPages() {
    const systemPages = new Map(); // command -> sections[]
    
    const manPaths = [
        '/usr/share/man',
        '/usr/local/share/man',
        '/opt/man'
    ];
    
    for (const manPath of manPaths) {
        if (!fs.existsSync(manPath)) continue;
        
        // Scan each section
        for (let section = 1; section <= 8; section++) {
            const sectionPaths = [
                path.join(manPath, `man${section}`),
                path.join(manPath, 'en', `man${section}`),
                path.join(manPath, 'en_US', `man${section}`),
                path.join(manPath, 'C', `man${section}`)
            ];
            
            for (const sectionPath of sectionPaths) {
                if (!fs.existsSync(sectionPath)) continue;
                
                try {
                    const files = fs.readdirSync(sectionPath);
                    
                    files.forEach(file => {
                        // Match various man page formats
                        const match = file.match(/^(.+?)\.(\d+[a-z]*)(?:\.gz|\.bz2|\.xz)?$/);
                        if (match) {
                            const [, command, fullSection] = match;
                            
                            if (!systemPages.has(command)) {
                                systemPages.set(command, new Set());
                            }
                            systemPages.get(command).add({
                                section: fullSection,
                                path: path.join(sectionPath, file)
                            });
                        }
                    });
                } catch (e) {
                    // Skip directories we can't read
                }
            }
        }
    }
    
    return systemPages;
}

// Check if content is in English
function isEnglishContent(content) {
    // Check for English section headers
    const englishHeaders = ['NAME', 'SYNOPSIS', 'DESCRIPTION', 'OPTIONS', 'EXAMPLES'];
    let headerCount = 0;
    
    for (const header of englishHeaders) {
        if (content.includes(header)) {
            headerCount++;
        }
    }
    
    // Check for non-Latin characters
    const nonLatinPattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF]/;
    if (nonLatinPattern.test(content)) {
        return false;
    }
    
    return headerCount >= 2;
}

// Convert man page to text
function convertManPageToText(manPath) {
    try {
        let content;
        
        // Set English locale
        const env = { ...process.env, LANG: 'C', LC_ALL: 'C' };
        
        if (manPath.endsWith('.gz')) {
            content = execSync(`zcat "${manPath}" | LANG=C LC_ALL=C man -l - 2>/dev/null | col -bx`, 
                { encoding: 'utf8', env, maxBuffer: 10 * 1024 * 1024 });
        } else if (manPath.endsWith('.bz2')) {
            content = execSync(`bzcat "${manPath}" | LANG=C LC_ALL=C man -l - 2>/dev/null | col -bx`, 
                { encoding: 'utf8', env, maxBuffer: 10 * 1024 * 1024 });
        } else if (manPath.endsWith('.xz')) {
            content = execSync(`xzcat "${manPath}" | LANG=C LC_ALL=C man -l - 2>/dev/null | col -bx`, 
                { encoding: 'utf8', env, maxBuffer: 10 * 1024 * 1024 });
        } else {
            content = execSync(`LANG=C LC_ALL=C man -l "${manPath}" 2>/dev/null | col -bx`, 
                { encoding: 'utf8', env, maxBuffer: 10 * 1024 * 1024 });
        }
        
        return content;
    } catch (e) {
        return null;
    }
}

// Main function
async function findAdditionalManPages() {
    console.log('Scanning for additional English man pages...\n');
    
    const existing = getExistingManPages();
    console.log(`Currently have ${existing.size} man pages\n`);
    
    console.log('Scanning system for available man pages...');
    const systemPages = getSystemManPages();
    console.log(`Found ${systemPages.size} commands with man pages on system\n`);
    
    const newPages = [];
    const stats = {
        scanned: 0,
        added: 0,
        skipped: 0,
        nonEnglish: 0,
        failed: 0
    };
    
    // Process each command
    for (const [command, sections] of systemPages) {
        stats.scanned++;
        
        // Skip if we already have this command
        if (existing.has(command)) {
            stats.skipped++;
            continue;
        }
        
        // Process each section for this command
        let foundEnglish = false;
        
        for (const sectionInfo of sections) {
            const key = `${command}.${sectionInfo.section}`;
            
            // Skip if we already have this specific section
            if (existing.has(key)) {
                continue;
            }
            
            // Try to convert and check if English
            const content = convertManPageToText(sectionInfo.path);
            
            if (content && isEnglishContent(content)) {
                // Save the man page
                const outputPath = path.join(MAN_PAGES_DIR, `${command}.${sectionInfo.section}.txt`);
                
                try {
                    fs.writeFileSync(outputPath, content);
                    newPages.push({
                        command,
                        section: sectionInfo.section,
                        size: content.length
                    });
                    stats.added++;
                    foundEnglish = true;
                    
                    if (stats.added % 10 === 0) {
                        console.log(`Added ${stats.added} new man pages...`);
                    }
                    
                    // Usually we only need one section per command
                    break;
                } catch (e) {
                    console.error(`Failed to save ${command}.${sectionInfo.section}: ${e.message}`);
                    stats.failed++;
                }
            } else if (content && !isEnglishContent(content)) {
                stats.nonEnglish++;
            }
        }
        
        // Progress indicator
        if (stats.scanned % 100 === 0) {
            process.stdout.write(`\rScanned ${stats.scanned}/${systemPages.size} commands...`);
        }
    }
    
    console.log('\n\n=== SCAN COMPLETE ===\n');
    console.log(`Total commands scanned: ${stats.scanned}`);
    console.log(`New man pages added: ${stats.added}`);
    console.log(`Already had: ${stats.skipped}`);
    console.log(`Non-English skipped: ${stats.nonEnglish}`);
    console.log(`Failed: ${stats.failed}`);
    
    if (newPages.length > 0) {
        console.log('\nSample of new man pages added:');
        newPages.slice(0, 20).forEach(page => {
            console.log(`  - ${page.command}(${page.section}) - ${(page.size / 1024).toFixed(1)}KB`);
        });
        
        if (newPages.length > 20) {
            console.log(`  ... and ${newPages.length - 20} more`);
        }
        
        // Save report
        const reportPath = path.join(__dirname, 'additional-manpages-report.json');
        fs.writeFileSync(reportPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            stats,
            newPages: newPages.slice(0, 100) // First 100 for reference
        }, null, 2));
        
        console.log(`\nDetailed report saved to: ${reportPath}`);
        console.log('\nNext steps:');
        console.log('1. Run "node extract-options.js" to update the search index');
        console.log('2. Test the application with the new man pages');
    }
    
    // Final count
    const finalCount = fs.readdirSync(MAN_PAGES_DIR).filter(f => f.endsWith('.txt')).length;
    console.log(`\nTotal man pages now: ${finalCount}`);
    
    // Cleanup
    if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true });
    }
}

// Look for specific missing commands
async function findMissingCommands() {
    const existing = getExistingManPages();
    
    // Common commands that should have man pages
    const commonCommands = [
        'ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'find',
        'sed', 'awk', 'tar', 'gzip', 'chmod', 'chown', 'ps', 'top', 'kill', 'df',
        'du', 'mount', 'umount', 'ssh', 'scp', 'rsync', 'curl', 'wget', 'git', 'vim',
        'nano', 'less', 'more', 'head', 'tail', 'sort', 'uniq', 'cut', 'paste', 'tr',
        'echo', 'printf', 'test', 'expr', 'bc', 'date', 'cal', 'which', 'whereis', 'locate',
        'apt', 'apt-get', 'dpkg', 'systemctl', 'journalctl', 'ip', 'ifconfig', 'netstat',
        'ping', 'traceroute', 'dig', 'nslookup', 'iptables', 'ufw', 'docker', 'python3',
        'perl', 'bash', 'sh', 'zsh', 'gcc', 'make', 'cmake', 'npm', 'node', 'cargo'
    ];
    
    const missing = [];
    
    for (const cmd of commonCommands) {
        if (!existing.has(cmd)) {
            missing.push(cmd);
        }
    }
    
    if (missing.length > 0) {
        console.log('\nMissing common commands:');
        console.log(missing.join(', '));
    }
    
    return missing;
}

// Main execution
if (require.main === module) {
    findAdditionalManPages()
        .then(() => findMissingCommands())
        .catch(console.error);
}

module.exports = { findAdditionalManPages };