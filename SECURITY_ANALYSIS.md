# Security Analysis - innerHTML Usage

## Summary
Found 33 instances of innerHTML usage in index.html. Risk assessment completed.

## Risk Categories

### 🔴 HIGH RISK - User Input (Priority 1)
These directly insert user-controlled content without sanitization:

1. **Command Explainer Input** (lines 4462-4735)
   - `commandBreakdown.innerHTML = tokenHTML;`
   - Directly renders user command input
   - ATTACK VECTOR: `<img src=x onerror=alert(1)>`

2. **Search Suggestions** (line 2893)
   - ```javascript
     suggestion.innerHTML = `
       <div class="suggestion-info">
         <div class="suggestion-command">${result.command}</div>
         <div class="suggestion-desc">${result.description}</div>
       </div>
     `;
     ```
   - Displays search results with command names
   - ATTACK VECTOR: Malicious command names in search index

### 🟡 MEDIUM RISK - Dynamic Data (Priority 2)
These render data from files or storage:

3. **Man Page Content** (lines 2963, 2978)
   - Renders man page headers and content
   - Risk if man pages contain malicious content

4. **TLDR Content** (lines 2501-2507)
   - Renders TLDR summaries
   - Risk if TLDR files compromised

5. **History/Bookmarks** (lines 2546, 2572)
   - Renders stored command names
   - Risk if localStorage manipulated

### 🟢 LOW RISK - Static Content (Priority 3)
These use innerHTML for:
- Clearing content (empty strings)
- Static messages
- Template rendering with controlled data

## Attack Scenarios

### Scenario 1: Command Explainer XSS
```bash
# User enters this in command explainer:
echo "<img src=x onerror=alert('XSS')>"
```
Result: JavaScript executes when rendering the command breakdown

### Scenario 2: Search Index Poisoning
If search index contains:
```javascript
{
  command: "<script>alert('XSS')</script>",
  description: "Malicious command"
}
```
Result: Script executes when displaying suggestions

### Scenario 3: localStorage Manipulation
If attacker modifies localStorage:
```javascript
localStorage.setItem('manPageHistory', JSON.stringify([{
  command: '<img src=x onerror=alert(1)>',
  timestamp: Date.now()
}]));
```
Result: XSS when viewing history

## Recommended Fixes

### Phase 1: Immediate (High Risk)
1. Create sanitization utilities
2. Fix Command Explainer input rendering
3. Fix search suggestion rendering

### Phase 2: Important (Medium Risk)
4. Sanitize man page content display
5. Sanitize TLDR content
6. Validate localStorage data

### Phase 3: Complete (Low Risk)
7. Replace remaining innerHTML uses
8. Implement Content Security Policy
9. Add input validation layer

## Implementation Strategy

### Step 1: Create Security Module
```javascript
const Security = {
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
  
  sanitizeCommand(cmd) {
    return cmd
      .replace(/[<>]/g, '') // Remove angle brackets
      .substring(0, 1000);  // Limit length
  }
};
```

### Step 2: Safe DOM Methods
Replace innerHTML with:
- `textContent` for plain text
- `createElement()` + `appendChild()` for complex structures
- Template elements for repeated content

### Step 3: Validation Layer
Add input validation before processing:
- Command length limits
- Character whitelist
- Pattern validation

## Testing Plan
1. Test each fix with malicious payloads
2. Verify functionality preserved
3. Check performance impact
4. Run automated security scan

## Rollback Plan
- Full backup created at: `backups/20250612_194417_pre_security_fixes/`
- Git tag before changes
- Feature flags for gradual rollout