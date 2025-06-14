# ldd

> Display shared library dependencies.
> More information: <https://man7.org/linux/man-pages/man1/ldd.1.html>.

- Display shared library dependencies:

`ldd {{path/to/binary}}`

- Display all information:

`ldd --verbose {{path/to/binary}}`

- Display unused direct dependencies:

`ldd --unused {{path/to/binary}}`

- Display missing data objects:

`ldd --data-relocs {{path/to/binary}}`

- Display missing functions:

`ldd --function-relocs {{path/to/binary}}`

- Display version information:

`ldd --version`

- Process all entries in a directory:

`ldd {{/path/to/directory/*}}`

- Check multiple binaries:

`ldd {{binary1}} {{binary2}} {{binary3}}`