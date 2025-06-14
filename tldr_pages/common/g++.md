# g++

> GNU C++ compiler.
> More information: <https://gcc.gnu.org/>.

- Compile a source file into an executable:

`g++ {{source.cpp}} -o {{output}}`

- Compile with debugging symbols:

`g++ -g {{source.cpp}} -o {{output}}`

- Compile with optimization:

`g++ -O2 {{source.cpp}} -o {{output}}`

- Include libraries:

`g++ {{source.cpp}} -o {{output}} -l{{library}}`

- Include directories for header files:

`g++ {{source.cpp}} -o {{output}} -I{{path/to/headers}}`

- Compile with all warnings:

`g++ -Wall {{source.cpp}} -o {{output}}`

- Compile to object file only:

`g++ -c {{source.cpp}}`

- Compile with specific standard:

`g++ -std={{c++17}} {{source.cpp}} -o {{output}}`