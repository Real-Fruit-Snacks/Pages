# du

> Disk usage: estimate and summarize file and directory space usage.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/du-invocation.html>.

- List the sizes of a directory and its subdirectories, in human-readable units:

`du {{[-h|--human-readable]}} {{path/to/directory}}`

- List the sizes of a directory and its subdirectories, up to N levels deep:

`du {{[-h|--human-readable]}} --max-depth={{N}} {{path/to/directory}}`

- List the size of a single directory, in human-readable units:

`du {{[-sh|--summarize --human-readable]}} {{path/to/directory}}`

- List the human-readable sizes of all `.jpg` files in subdirectories of the current directory:

`du {{[-ch|--total --human-readable]}} {{*/*.jpg}}`

- List all files and directories (including hidden ones) above a certain size:

`du {{[-ah|--all --human-readable]}} {{path/to/directory}} | grep -E '{{[0-9]+(G|M)}}'`

- Show the size of each directory in bytes, sorted by size:

`du {{[-b|--bytes]}} {{path/to/directory}} | sort -n`

- Exclude files that match a pattern:

`du {{[-h|--human-readable]}} --exclude='{{*.txt}}' {{path/to/directory}}`

- Show the total size of files matching a pattern:

`du {{[-ch|--total --human-readable]}} {{path/to/directory/*.log}}`