# gcc

> GNU C compiler.
> More information: <https://gcc.gnu.org/>.

- Compile a source file into an executable:

`gcc {{source.c}} -o {{output}}`

- Compile with debugging symbols:

`gcc -g {{source.c}} -o {{output}}`

- Compile with optimization:

`gcc -O2 {{source.c}} -o {{output}}`

- Include libraries:

`gcc {{source.c}} -o {{output}} -l{{library}}`

- Include directories for header files:

`gcc {{source.c}} -o {{output}} -I{{path/to/headers}}`

- Compile with all warnings:

`gcc -Wall {{source.c}} -o {{output}}`

- Compile to object file only:

`gcc -c {{source.c}}`

- Compile with specific standard:

`gcc -std={{c11}} {{source.c}} -o {{output}}`