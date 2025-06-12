#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const zlib = require('zlib');

// Configuration
const MAN_PAGES_DIR = path.join(__dirname, 'man_pages');
const TEMP_DIR = path.join(__dirname, 'temp_man_fetch');

// Ensure directories exist
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Common packages that contain many man pages
const PACKAGES_WITH_MAN_PAGES = [
    // Core system utilities
    'manpages',
    'manpages-dev',
    'manpages-posix',
    'manpages-posix-dev',
    'man-db',
    
    // GNU coreutils and utilities
    'coreutils',
    'util-linux',
    'procps',
    'findutils',
    'diffutils',
    'grep',
    'sed',
    'gawk',
    'tar',
    'gzip',
    'bzip2',
    'xz-utils',
    
    // Development tools
    'gcc-doc',
    'glibc-doc',
    'libc-dev-bin',
    'binutils',
    'make-doc',
    'autoconf-doc',
    'automake',
    'cmake-doc',
    'git-man',
    'subversion',
    
    // System administration
    'systemd',
    'openssh-client',
    'openssh-server',
    'sudo',
    'passwd',
    'shadow',
    'net-tools',
    'iproute2',
    'iptables',
    'ufw',
    
    // Programming languages
    'perl-doc',
    'python3-doc',
    'ruby-doc',
    'nodejs-doc',
    'golang-doc',
    'rustc-doc',
    
    // Database tools
    'postgresql-doc',
    'mysql-server',
    'sqlite3-doc',
    'redis-tools',
    
    // Web servers and tools
    'apache2-doc',
    'nginx-doc',
    'curl',
    'wget',
    'lynx-doc',
    
    // File systems and disk utilities
    'e2fsprogs',
    'xfsprogs',
    'btrfs-progs',
    'lvm2',
    'mdadm',
    'smartmontools',
    
    // Networking
    'bind9-doc',
    'isc-dhcp-client',
    'isc-dhcp-server',
    'tcpdump',
    'wireshark-doc',
    'nmap',
    
    // Text processing
    'vim-doc',
    'emacs-common',
    'nano-doc',
    'pandoc',
    'texlive-latex-base-doc',
    
    // Compression and archives
    'p7zip-full',
    'unzip',
    'zip',
    'rar',
    'unrar',
    
    // Media tools
    'ffmpeg-doc',
    'imagemagick-doc',
    'sox',
    
    // Security tools
    'openssl',
    'gnupg2',
    'cryptsetup',
    'apparmor-utils',
    
    // X11 and desktop
    'x11-common',
    'xorg-docs',
    'mesa-utils',
    
    // Additional utilities
    'tmux',
    'screen',
    'htop',
    'ncdu',
    'tree',
    'jq',
    'xmlstarlet',
    'bc',
    'dc'
];

async function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(destPath);
        
        protocol.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirect
                downloadFile(response.headers.location, destPath)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(destPath, () => {});
            reject(err);
        });
    });
}

function extractDebPackage(debPath, extractPath) {
    // Extract .deb package
    execSync(`ar x ${debPath}`, { cwd: extractPath });
    
    // Extract data.tar.* file
    const dataFiles = fs.readdirSync(extractPath).filter(f => f.startsWith('data.tar'));
    if (dataFiles.length > 0) {
        const dataFile = path.join(extractPath, dataFiles[0]);
        if (dataFile.endsWith('.gz')) {
            execSync(`tar -xzf ${dataFile}`, { cwd: extractPath });
        } else if (dataFile.endsWith('.xz')) {
            execSync(`tar -xJf ${dataFile}`, { cwd: extractPath });
        } else if (dataFile.endsWith('.bz2')) {
            execSync(`tar -xjf ${dataFile}`, { cwd: extractPath });
        }
    }
}

function convertManToText(manPath, section) {
    let content = fs.readFileSync(manPath);
    
    // If file is gzipped, decompress it
    if (manPath.endsWith('.gz')) {
        content = zlib.gunzipSync(content);
    }
    
    // Use man command to convert to text if available
    try {
        const tempFile = path.join(TEMP_DIR, 'temp.man');
        fs.writeFileSync(tempFile, content);
        const text = execSync(`man -l -Tutf8 ${tempFile} | col -bx`, { encoding: 'utf8' });
        fs.unlinkSync(tempFile);
        return text;
    } catch (e) {
        // Fallback: return raw content
        return content.toString();
    }
}

async function fetchManPagesFromPackage(packageName) {
    console.log(`\nFetching man pages from package: ${packageName}`);
    
    const packageDir = path.join(TEMP_DIR, packageName);
    if (!fs.existsSync(packageDir)) {
        fs.mkdirSync(packageDir, { recursive: true });
    }
    
    try {
        // Get package info from Ubuntu repository
        const packageUrl = `http://packages.ubuntu.com/jammy/amd64/${packageName}/download`;
        
        // This is a simplified approach - in reality, you'd need to parse the HTML
        // or use the Ubuntu API to get the actual .deb download URL
        console.log(`  Would fetch from: ${packageUrl}`);
        console.log(`  (Note: Actual implementation would require parsing package repository)`);
        
        // For now, let's check if we can find man pages locally
        const localManPaths = [
            `/usr/share/man`,
            `/usr/local/share/man`,
            `/opt/man`
        ];
        
        let foundCount = 0;
        for (const manPath of localManPaths) {
            if (fs.existsSync(manPath)) {
                // Look for man pages related to this package
                for (let section = 1; section <= 8; section++) {
                    const sectionPath = path.join(manPath, `man${section}`);
                    if (fs.existsSync(sectionPath)) {
                        const files = fs.readdirSync(sectionPath);
                        for (const file of files) {
                            if (file.includes(packageName.split('-')[0])) {
                                foundCount++;
                                // Would process and copy the file here
                            }
                        }
                    }
                }
            }
        }
        
        if (foundCount > 0) {
            console.log(`  Found ${foundCount} related man pages locally`);
        }
        
    } catch (error) {
        console.error(`  Error processing ${packageName}: ${error.message}`);
    }
}

// Alternative: Fetch from system if available
function fetchSystemManPages() {
    console.log('\nScanning system for man pages...');
    
    const systemManPaths = [
        '/usr/share/man',
        '/usr/local/share/man',
        '/opt/man'
    ];
    
    const existingManPages = new Set(fs.readdirSync(MAN_PAGES_DIR));
    let newManPages = 0;
    let processedManPages = 0;
    
    for (const manPath of systemManPaths) {
        if (!fs.existsSync(manPath)) continue;
        
        console.log(`\nScanning ${manPath}...`);
        
        for (let section = 1; section <= 8; section++) {
            const sectionPath = path.join(manPath, `man${section}`);
            if (!fs.existsSync(sectionPath)) continue;
            
            const files = fs.readdirSync(sectionPath);
            console.log(`  Section ${section}: ${files.length} files`);
            
            for (const file of files) {
                processedManPages++;
                
                // Extract command name and section
                const match = file.match(/^(.+?)\.(\d+)(\.gz)?$/);
                if (!match) continue;
                
                const [, command, fileSection] = match;
                const outputFileName = `${command}.${fileSection}.txt`;
                
                if (!existingManPages.has(outputFileName)) {
                    try {
                        const sourcePath = path.join(sectionPath, file);
                        const outputPath = path.join(MAN_PAGES_DIR, outputFileName);
                        
                        // Convert and save
                        const text = convertManToText(sourcePath, fileSection);
                        fs.writeFileSync(outputPath, text);
                        
                        newManPages++;
                        if (newManPages % 100 === 0) {
                            console.log(`    Processed ${newManPages} new man pages...`);
                        }
                    } catch (error) {
                        // Skip files we can't process
                    }
                }
            }
        }
    }
    
    console.log(`\nSummary:`);
    console.log(`  Total man pages scanned: ${processedManPages}`);
    console.log(`  New man pages added: ${newManPages}`);
    console.log(`  Total man pages in project: ${fs.readdirSync(MAN_PAGES_DIR).length}`);
    
    return newManPages;
}

// Main execution
async function main() {
    console.log('Man Page Fetcher for Linux Man Pages Project');
    console.log('============================================\n');
    
    // Check if running on a Linux system with man pages installed
    const hasLocalManPages = fs.existsSync('/usr/share/man');
    
    if (hasLocalManPages) {
        console.log('Local man pages detected. Fetching from system...');
        const newPages = fetchSystemManPages();
        
        if (newPages > 0) {
            console.log('\nUpdating search index...');
            // Would run: node extract-options.js
            console.log('(Run extract-options.js to update the search index)');
        }
    } else {
        console.log('No local man pages found.');
        console.log('\nTo fetch man pages from Ubuntu/Debian packages:');
        console.log('1. Run this script on a Linux system with man pages installed');
        console.log('2. Or implement package downloading from Ubuntu repositories');
        console.log('\nPackages that would be fetched:');
        PACKAGES_WITH_MAN_PAGES.slice(0, 10).forEach(pkg => {
            console.log(`  - ${pkg}`);
        });
        console.log(`  ... and ${PACKAGES_WITH_MAN_PAGES.length - 10} more packages`);
    }
    
    // Cleanup
    if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true });
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { fetchSystemManPages, PACKAGES_WITH_MAN_PAGES };