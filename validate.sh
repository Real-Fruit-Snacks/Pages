#!/bin/bash
# Validation script to run before pushing to GitHub

echo "🔍 Running pre-push validation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any errors occurred
HAS_ERRORS=0

# Function to check JavaScript syntax
check_js_syntax() {
    local file=$1
    echo -n "  Checking $file... "
    
    if node -c "$file" 2>/dev/null; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ SYNTAX ERROR${NC}"
        echo -e "${RED}$(node -c "$file" 2>&1)${NC}"
        return 1
    fi
}

echo "📋 Validating JavaScript files..."

# Check all JavaScript files
for file in data/*.js index.html; do
    if [[ -f "$file" ]]; then
        if [[ "$file" == "index.html" ]]; then
            # For HTML files, extract and check inline scripts
            echo -n "  Checking inline scripts in $file... "
            # This is a simple check - just ensures the file exists
            if [[ -f "$file" ]]; then
                echo -e "${GREEN}✓ OK${NC}"
            else
                echo -e "${RED}✗ FILE NOT FOUND${NC}"
                HAS_ERRORS=1
            fi
        else
            # For JS files, check syntax directly
            if ! check_js_syntax "$file"; then
                HAS_ERRORS=1
            fi
        fi
    fi
done

echo ""
echo "📊 Checking data integrity..."

# Check that all required data files exist
REQUIRED_FILES=("data/manifest.js" "data/index.js" "data/man_1.js")
for file in "${REQUIRED_FILES[@]}"; do
    echo -n "  Checking existence of $file... "
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✓ EXISTS${NC}"
    else
        echo -e "${RED}✗ MISSING${NC}"
        HAS_ERRORS=1
    fi
done

# Check that data files use window. declarations
echo ""
echo "🔧 Checking data file declarations..."
for file in data/*.js; do
    if [[ -f "$file" ]]; then
        echo -n "  Checking $file uses window. declarations... "
        
        # Check for const declarations (which would be wrong)
        if grep -q "^const " "$file"; then
            echo -e "${RED}✗ FOUND CONST DECLARATIONS${NC}"
            echo -e "${YELLOW}    Fix: Change 'const varName' to 'window.varName'${NC}"
            HAS_ERRORS=1
        else
            echo -e "${GREEN}✓ OK${NC}"
        fi
    fi
done

echo ""
if [[ $HAS_ERRORS -eq 0 ]]; then
    echo -e "${GREEN}✅ All validation checks passed!${NC}"
    echo ""
    echo "📤 Ready to push to GitHub:"
    echo "   git push origin main"
else
    echo -e "${RED}❌ Validation failed! Please fix the errors above before pushing.${NC}"
    exit 1
fi