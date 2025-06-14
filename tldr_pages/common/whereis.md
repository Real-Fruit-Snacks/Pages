# whereis

> Locate the binary, source, and manual page files for a command.
> More information: <https://man7.org/linux/man-pages/man1/whereis.1.html>.

- Locate binary, source, and manual pages for a command:

`whereis {{command}}`

- Locate only the binary for a command:

`whereis -b {{command}}`

- Locate only the manual pages for a command:

`whereis -m {{command}}`

- Locate only the source files for a command:

`whereis -s {{command}}`

- Locate binaries in specific directories:

`whereis -B {{/path/to/directory}} -f {{command}}`

- Locate man pages in specific directories:

`whereis -M {{/path/to/directory}} -f {{command}}`

- Show only the paths (quiet mode):

`whereis -q {{command}}`

- Locate multiple commands:

`whereis {{command1}} {{command2}} {{command3}}`