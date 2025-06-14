# readelf

> Display information about ELF files.
> More information: <https://man7.org/linux/man-pages/man1/readelf.1.html>.

- Display all information:

`readelf -a {{binary}}`

- Display file headers:

`readelf -h {{binary}}`

- Display section headers:

`readelf -S {{binary}}`

- Display program headers:

`readelf -l {{binary}}`

- Display symbol table:

`readelf -s {{binary}}`

- Display dynamic section:

`readelf -d {{binary}}`

- Display relocation entries:

`readelf -r {{binary}}`

- Display notes:

`readelf -n {{binary}}`