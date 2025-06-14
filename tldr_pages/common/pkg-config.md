# pkg-config

> Provide compiler and linker flags for libraries.
> More information: <https://www.freedesktop.org/wiki/Software/pkg-config/>.

- Get compile flags for a library:

`pkg-config --cflags {{library}}`

- Get link flags for a library:

`pkg-config --libs {{library}}`

- Get compile and link flags:

`pkg-config --cflags --libs {{library}}`

- Check if a library exists:

`pkg-config --exists {{library}}`

- Get the version of a library:

`pkg-config --modversion {{library}}`

- List all available packages:

`pkg-config --list-all`

- Get variable value from a library:

`pkg-config --variable={{prefix}} {{library}}`

- Display errors for missing packages:

`pkg-config --print-errors {{library}}`