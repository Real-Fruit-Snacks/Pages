#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MAN_PAGES_DIR = path.join(__dirname, 'man_pages');

// Common non-English patterns to detect
const nonEnglishPatterns = {
    // Japanese
    japanese: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
    // Chinese
    chinese: /[\u4E00-\u9FFF]/,
    // Korean
    korean: /[\uAC00-\uD7AF]/,
    // Arabic
    arabic: /[\u0600-\u06FF]/,
    // Russian/Cyrillic
    cyrillic: /[\u0400-\u04FF]/,
    // Hebrew
    hebrew: /[\u0590-\u05FF]/,
    // Greek
    greek: /[\u0370-\u03FF]/,
    // Thai
    thai: /[\u0E00-\u0E7F]/,
    // Common non-English words in European languages
    french: /\b(voir|pour|avec|dans|plus|cette|être|avoir|faire)\b/i,
    german: /\b(siehe|für|mit|der|die|das|ist|wird|werden)\b/i,
    spanish: /\b(para|con|por|los|las|del|está|son)\b/i,
    italian: /\b(per|con|del|della|sono|essere|fare)\b/i,
    portuguese: /\b(para|com|por|dos|das|está|são)\b/i,
    dutch: /\b(voor|met|van|het|een|zijn|worden)\b/i,
    polish: /\b(dla|przez|jest|są|być|może)\b/i,
    swedish: /\b(för|med|och|är|kan|ska|att)\b/i,
    // Look for non-ASCII characters that are common in European languages
    extendedLatin: /[À-ÿĀ-žА-я]/
};

// Common English section headers in man pages
const englishSectionHeaders = [
    'NAME', 'SYNOPSIS', 'DESCRIPTION', 'OPTIONS', 'EXAMPLES', 
    'SEE ALSO', 'AUTHOR', 'AUTHORS', 'COPYRIGHT', 'LICENSE',
    'BUGS', 'REPORTING BUGS', 'HISTORY', 'NOTES', 'RETURN VALUE',
    'EXIT STATUS', 'ENVIRONMENT', 'FILES', 'STANDARDS', 'AVAILABILITY'
];

function detectLanguage(content) {
    // First, check for non-Latin scripts
    for (const [lang, pattern] of Object.entries(nonEnglishPatterns)) {
        if (pattern.test(content)) {
            // For extended Latin, check if it's just a few characters (names, etc.)
            if (lang === 'extendedLatin') {
                const matches = content.match(pattern);
                if (matches && matches.length > 50) {
                    // More than 50 non-ASCII characters suggests non-English
                    return { isEnglish: false, detectedLanguage: 'european', confidence: 'medium' };
                }
            } else {
                return { isEnglish: false, detectedLanguage: lang, confidence: 'high' };
            }
        }
    }
    
    // Check for English section headers
    let englishHeaderCount = 0;
    for (const header of englishSectionHeaders) {
        if (content.includes(header + '\n') || content.includes(header + '\r\n')) {
            englishHeaderCount++;
        }
    }
    
    // If we find multiple English headers, it's likely English
    if (englishHeaderCount >= 3) {
        return { isEnglish: true, detectedLanguage: 'english', confidence: 'high' };
    }
    
    // Check for common non-English section headers
    const nonEnglishHeaders = {
        french: ['NOM', 'SYNOPSIS', 'DESCRIPTION', 'OPTIONS', 'VOIR AUSSI', 'AUTEUR'],
        german: ['BEZEICHNUNG', 'ÜBERSICHT', 'BESCHREIBUNG', 'OPTIONEN', 'SIEHE AUCH', 'AUTOR'],
        spanish: ['NOMBRE', 'SINOPSIS', 'DESCRIPCIÓN', 'OPCIONES', 'VÉASE TAMBIÉN', 'AUTOR'],
        italian: ['NOME', 'SINOSSI', 'DESCRIZIONE', 'OPZIONI', 'VEDERE ANCHE', 'AUTORE'],
        portuguese: ['NOME', 'SINOPSE', 'DESCRIÇÃO', 'OPÇÕES', 'VEJA TAMBÉM', 'AUTOR'],
        polish: ['NAZWA', 'SKŁADNIA', 'OPIS', 'OPCJE', 'ZOBACZ TAKŻE', 'AUTOR'],
        russian: ['НАЗВАНИЕ', 'ОБЗОР', 'ОПИСАНИЕ', 'ПАРАМЕТРЫ', 'СМОТРИ ТАКЖЕ', 'АВТОР']
    };
    
    for (const [lang, headers] of Object.entries(nonEnglishHeaders)) {
        let matchCount = 0;
        for (const header of headers) {
            if (content.includes(header)) {
                matchCount++;
            }
        }
        if (matchCount >= 2) {
            return { isEnglish: false, detectedLanguage: lang, confidence: 'high' };
        }
    }
    
    // Default to English if uncertain
    return { isEnglish: true, detectedLanguage: 'english', confidence: 'low' };
}

async function scanManPages() {
    const files = fs.readdirSync(MAN_PAGES_DIR).filter(f => f.endsWith('.txt'));
    const nonEnglishPages = [];
    const stats = {
        total: files.length,
        english: 0,
        nonEnglish: 0,
        byLanguage: {}
    };
    
    console.log(`Scanning ${files.length} man pages for non-English content...\n`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(MAN_PAGES_DIR, file);
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const result = detectLanguage(content);
            
            if (!result.isEnglish) {
                nonEnglishPages.push({
                    file,
                    language: result.detectedLanguage,
                    confidence: result.confidence
                });
                stats.nonEnglish++;
                stats.byLanguage[result.detectedLanguage] = (stats.byLanguage[result.detectedLanguage] || 0) + 1;
                
                // Show first few lines of non-English pages
                if (nonEnglishPages.length <= 5) {
                    console.log(`\nFound non-English page: ${file} (${result.detectedLanguage})`);
                    const preview = content.split('\n').slice(0, 5).join('\n');
                    console.log('Preview:');
                    console.log(preview);
                    console.log('---');
                }
            } else {
                stats.english++;
            }
            
            // Progress indicator
            if ((i + 1) % 100 === 0) {
                process.stdout.write(`\rProcessed ${i + 1}/${files.length} files...`);
            }
        } catch (error) {
            console.error(`\nError reading ${file}: ${error.message}`);
        }
    }
    
    console.log('\n\n=== SCAN COMPLETE ===\n');
    console.log(`Total man pages: ${stats.total}`);
    console.log(`English pages: ${stats.english}`);
    console.log(`Non-English pages: ${stats.nonEnglish}`);
    
    if (stats.nonEnglish > 0) {
        console.log('\nBreakdown by language:');
        for (const [lang, count] of Object.entries(stats.byLanguage)) {
            console.log(`  ${lang}: ${count}`);
        }
        
        // Save results to file
        const reportPath = path.join(__dirname, 'non-english-manpages.json');
        fs.writeFileSync(reportPath, JSON.stringify({
            summary: stats,
            pages: nonEnglishPages
        }, null, 2));
        console.log(`\nDetailed report saved to: ${reportPath}`);
        
        // Show all non-English files if not too many
        if (nonEnglishPages.length <= 50) {
            console.log('\nAll non-English man pages:');
            nonEnglishPages.forEach(page => {
                console.log(`  - ${page.file} (${page.language}, confidence: ${page.confidence})`);
            });
        } else {
            console.log(`\nToo many non-English pages to list. Check ${reportPath} for full list.`);
        }
    }
    
    return nonEnglishPages;
}

// Function to suggest replacements
function suggestReplacements(nonEnglishPages) {
    console.log('\n=== REPLACEMENT SUGGESTIONS ===\n');
    
    const replacements = [];
    
    for (const page of nonEnglishPages) {
        // Extract command name and section
        const match = page.file.match(/^(.+?)\.(\d+.*)\.txt$/);
        if (match) {
            const [, command, section] = match;
            
            replacements.push({
                original: page.file,
                command,
                section,
                language: page.language,
                suggestion: `Download English version of ${command}(${section}) from man-pages project or Ubuntu packages`
            });
        }
    }
    
    // Group by language for easier processing
    const byLanguage = {};
    replacements.forEach(r => {
        if (!byLanguage[r.language]) {
            byLanguage[r.language] = [];
        }
        byLanguage[r.language].push(r);
    });
    
    // Show grouped suggestions
    for (const [lang, items] of Object.entries(byLanguage)) {
        console.log(`\n${lang.toUpperCase()} pages (${items.length}):`);
        items.slice(0, 10).forEach(item => {
            console.log(`  - ${item.command}(${item.section})`);
        });
        if (items.length > 10) {
            console.log(`  ... and ${items.length - 10} more`);
        }
    }
    
    return replacements;
}

// Main execution
async function main() {
    try {
        const nonEnglishPages = await scanManPages();
        
        if (nonEnglishPages.length > 0) {
            const replacements = suggestReplacements(nonEnglishPages);
            
            console.log('\n\nNext steps:');
            console.log('1. Run "node replace-non-english-manpages.js" to automatically replace these pages');
            console.log('2. Or manually download English versions from:');
            console.log('   - https://www.kernel.org/doc/man-pages/');
            console.log('   - Ubuntu packages: apt-get download <package> && dpkg -x <package.deb> .');
            console.log('3. After replacement, run "node extract-options.js" to update the search index');
        } else {
            console.log('\nGreat! All man pages appear to be in English.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = { detectLanguage, scanManPages };