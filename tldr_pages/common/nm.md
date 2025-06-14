# nm

> List symbols from object files.
> More information: <https://man7.org/linux/man-pages/man1/nm.1.html>.

- List symbols from a file:

`nm {{binary}}`

- List only external symbols:

`nm -g {{binary}}`

- List only undefined symbols:

`nm -u {{binary}}`

- Sort symbols by address:

`nm -n {{binary}}`

- Demangle C++ symbols:

`nm -C {{binary}}`

- List symbols with their types:

`nm -a {{binary}}`

- Display dynamic symbols:

`nm -D {{binary}}`

- Display symbols in specific format:

`nm -f {{posix}} {{binary}}`