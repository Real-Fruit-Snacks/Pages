# objdump

> Display information from object files.
> More information: <https://man7.org/linux/man-pages/man1/objdump.1.html>.

- Display file headers:

`objdump -f {{binary}}`

- Display all headers:

`objdump -x {{binary}}`

- Display disassembly of executable sections:

`objdump -d {{binary}}`

- Display disassembly with source code:

`objdump -S {{binary}}`

- Display all sections:

`objdump -s {{binary}}`

- Display symbol table:

`objdump -t {{binary}}`

- Display dynamic symbol table:

`objdump -T {{binary}}`

- Display relocation entries:

`objdump -r {{binary}}`