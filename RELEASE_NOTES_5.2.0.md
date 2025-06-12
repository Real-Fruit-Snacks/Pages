# Release v5.2.0: Command Explainer Enhancement

## Major Updates

### Enhanced Command Explainer
- Fixed option context tracking in command pipelines - options now correctly associate with their respective commands
- Added comprehensive shell construct support:
  - Background operator `&`
  - Process substitution `<()` and `>()`
  - Here documents `<<`, `<<<`, `<<-`
  - Shell keywords (if, then, for, do, etc.)
- Enhanced UI for multi-command support:
  - Command Overview shows all commands in pipelines
  - Command flow visualization
  - Options grouped by their associated command
  - Examples loaded for all commands

### UI Improvements
- Converted command input from single-line to multi-line textarea with resize capability
- Added scrolling support for all sections to handle long commands
- Enhanced token display with expand-on-hover functionality
- Improved tooltips and history items for better readability

### Content Updates
- Expanded man page collection to 8,121 entries
- Added more English-only man pages from system sources
- Updated documentation to reflect current capabilities

## Technical Details
- Parser now tracks command context through pipelines and operators
- Added token types for all major shell constructs
- CSS updates for improved overflow handling
- Modal size increased to accommodate complex commands

## Bug Fixes
- Fixed incorrect option descriptions in piped commands
- Fixed command context reset for background operators
- Resolved CSS conflicts in theme system

## Installation
Download the latest release package for offline deployment on GitHub Pages or GitLab Pages.

## Acknowledgments
Thanks to the community for feedback on improving the Command Explainer feature!