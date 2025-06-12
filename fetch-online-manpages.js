#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const zlib = require('zlib');

const MAN_PAGES_DIR = path.join(__dirname, 'man_pages');
const TEMP_DIR = path.join(__dirname, 'temp_online_man');

// Ensure directories exist
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Download file from URL
function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirect
                downloadFile(response.headers.location, destPath)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', reject);
    });
}

// Extract tar.gz file
function extractTarGz(filePath, destDir) {
    execSync(`tar -xzf "${filePath}" -C "${destDir}"`, { stdio: 'pipe' });
}

// Get existing man pages
function getExistingManPages() {
    const existing = new Set();
    const files = fs.readdirSync(MAN_PAGES_DIR);
    
    files.forEach(file => {
        const match = file.match(/^(.+?)\.(\d+.*)\.txt$/);
        if (match) {
            existing.add(`${match[1]}.${match[2]}`);
        }
    });
    
    return existing;
}

// Convert man page to text
function convertManToText(manPath) {
    try {
        const content = fs.readFileSync(manPath);
        
        // Use groff to convert to text
        const tempFile = path.join(TEMP_DIR, 'temp.man');
        fs.writeFileSync(tempFile, content);
        
        const text = execSync(`LANG=C LC_ALL=C man -l -Tutf8 "${tempFile}" 2>/dev/null | col -bx`, 
            { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
        
        fs.unlinkSync(tempFile);
        return text;
    } catch (e) {
        return null;
    }
}

// Check if content is English
function isEnglish(content) {
    // Check for English section headers
    const englishHeaders = ['NAME', 'SYNOPSIS', 'DESCRIPTION', 'OPTIONS', 'SEE ALSO'];
    let headerCount = 0;
    
    for (const header of englishHeaders) {
        if (content.includes('\n' + header + '\n')) {
            headerCount++;
        }
    }
    
    return headerCount >= 2;
}

// Fetch man pages from kernel.org
async function fetchKernelOrgManPages() {
    console.log('\n=== Fetching from kernel.org ===\n');
    
    const existing = getExistingManPages();
    const baseUrl = 'https://www.kernel.org/pub/linux/docs/man-pages/';
    
    try {
        // Download latest man-pages tarball
        console.log('Finding latest man-pages release...');
        
        // For this example, let's use a known version
        const version = 'man-pages-6.05.01.tar.gz';
        const url = `${baseUrl}${version}`;
        const destFile = path.join(TEMP_DIR, version);
        
        console.log(`Downloading ${version}...`);
        await downloadFile(url, destFile);
        
        console.log('Extracting...');
        const extractDir = path.join(TEMP_DIR, 'kernel-man-pages');
        fs.mkdirSync(extractDir, { recursive: true });
        extractTarGz(destFile, extractDir);
        
        // Process man pages
        let added = 0;
        const manDirs = fs.readdirSync(extractDir);
        
        for (const dir of manDirs) {
            const manPath = path.join(extractDir, dir);
            if (!fs.statSync(manPath).isDirectory()) continue;
            
            // Look for man directories
            for (let section = 1; section <= 8; section++) {
                const sectionDir = path.join(manPath, `man${section}`);
                if (!fs.existsSync(sectionDir)) continue;
                
                const files = fs.readdirSync(sectionDir);
                for (const file of files) {
                    const match = file.match(/^(.+?)\.(\d+.*)$/);
                    if (!match) continue;
                    
                    const [, command, fullSection] = match;
                    const key = `${command}.${fullSection}`;
                    
                    if (existing.has(key)) continue;
                    
                    const sourcePath = path.join(sectionDir, file);
                    const text = convertManToText(sourcePath);
                    
                    if (text && isEnglish(text)) {
                        const outputPath = path.join(MAN_PAGES_DIR, `${command}.${fullSection}.txt`);
                        fs.writeFileSync(outputPath, text);
                        added++;
                        
                        if (added % 10 === 0) {
                            console.log(`Added ${added} man pages...`);
                        }
                    }
                }
            }
        }
        
        console.log(`\nAdded ${added} new man pages from kernel.org`);
        
        // Cleanup
        fs.rmSync(extractDir, { recursive: true });
        fs.unlinkSync(destFile);
        
    } catch (error) {
        console.error('Error fetching from kernel.org:', error.message);
    }
}

// Fetch specific missing commands from Ubuntu
async function fetchUbuntuManPages(commands) {
    console.log('\n=== Fetching from Ubuntu manpages ===\n');
    
    const existing = getExistingManPages();
    const baseUrl = 'https://manpages.ubuntu.com/manpages.gz/jammy/en/man';
    let added = 0;
    
    for (const command of commands) {
        if (existing.has(command) || existing.has(`${command}.1`)) continue;
        
        // Try different sections
        for (let section = 1; section <= 8; section++) {
            const url = `${baseUrl}${section}/${command}.${section}.gz`;
            const destFile = path.join(TEMP_DIR, `${command}.${section}.gz`);
            
            try {
                await downloadFile(url, destFile);
                
                // Decompress and convert
                const gzContent = fs.readFileSync(destFile);
                const content = zlib.gunzipSync(gzContent);
                
                const tempMan = path.join(TEMP_DIR, `${command}.${section}`);
                fs.writeFileSync(tempMan, content);
                
                const text = convertManToText(tempMan);
                
                if (text && isEnglish(text)) {
                    const outputPath = path.join(MAN_PAGES_DIR, `${command}.${section}.txt`);
                    fs.writeFileSync(outputPath, text);
                    console.log(`Added: ${command}(${section})`);
                    added++;
                    break; // Found it, no need to check other sections
                }
                
                // Cleanup
                fs.unlinkSync(destFile);
                fs.unlinkSync(tempMan);
                
            } catch (e) {
                // Not found in this section, try next
            }
        }
    }
    
    console.log(`\nAdded ${added} new man pages from Ubuntu`);
}

// List of commonly missing commands to fetch
const missingCommands = [
    // Development tools
    'gcc', 'g++', 'clang', 'rustc', 'cargo', 'go', 'javac', 'java',
    'node', 'npm', 'yarn', 'pip', 'pip3', 'gem', 'bundle', 'composer',
    
    // Build tools
    'cmake', 'meson', 'ninja', 'autoconf', 'automake', 'libtool',
    
    // Version control
    'svn', 'hg', 'bzr', 'fossil',
    
    // Containers and virtualization
    'podman', 'kubectl', 'minikube', 'vagrant', 'virt-manager',
    'virsh', 'qemu', 'vboxmanage',
    
    // Network tools
    'nmap', 'tcpdump', 'wireshark', 'tshark', 'mtr', 'iftop',
    'nethogs', 'ss', 'lsof', 'nc', 'socat',
    
    // System tools
    'strace', 'ltrace', 'perf', 'valgrind', 'gdb', 'objdump',
    'readelf', 'nm', 'ldd', 'file', 'strings',
    
    // Package managers
    'snap', 'flatpak', 'brew', 'yum', 'dnf', 'zypper', 'pacman',
    
    // Text processing
    'jq', 'xmllint', 'xsltproc', 'pandoc', 'aspell', 'hunspell',
    
    // Multimedia
    'ffmpeg', 'ffprobe', 'ffplay', 'mpv', 'vlc', 'convert',
    'identify', 'mogrify', 'sox', 'play',
    
    // Compression
    'zstd', 'lz4', 'brotli', 'pigz', 'pbzip2', 'pixz',
    
    // Databases
    'mysql', 'psql', 'sqlite3', 'redis-cli', 'mongo', 'cqlsh',
    
    // Web servers
    'nginx', 'apache2', 'httpd', 'lighttpd', 'caddy'
];

// Main function
async function main() {
    console.log('Fetching additional man pages from online sources...\n');
    
    const startCount = fs.readdirSync(MAN_PAGES_DIR).filter(f => f.endsWith('.txt')).length;
    console.log(`Starting with ${startCount} man pages`);
    
    // Fetch from different sources
    await fetchKernelOrgManPages();
    await fetchUbuntuManPages(missingCommands);
    
    const endCount = fs.readdirSync(MAN_PAGES_DIR).filter(f => f.endsWith('.txt')).length;
    const added = endCount - startCount;
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total man pages added: ${added}`);
    console.log(`Total man pages now: ${endCount}`);
    
    if (added > 0) {
        console.log('\nNext steps:');
        console.log('1. Run "node extract-options.js" to update the search index');
        console.log('2. Test the application with the new man pages');
    }
    
    // Cleanup
    if (fs.existsSync(TEMP_DIR)) {
        fs.rmSync(TEMP_DIR, { recursive: true });
    }
}

// Additional sources to consider:
console.log('\nOther sources to manually check:');
console.log('1. GNU Software: https://ftp.gnu.org/gnu/');
console.log('2. Arch Linux: https://man.archlinux.org/');
console.log('3. FreeBSD (for cross-platform): https://www.freebsd.org/cgi/man.cgi');
console.log('4. POSIX specs: https://pubs.opengroup.org/onlinepubs/9699919799/');
console.log('5. Debian packages: https://packages.debian.org/');

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { fetchKernelOrgManPages, fetchUbuntuManPages };