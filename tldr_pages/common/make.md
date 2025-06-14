# make

> Build automation tool for compiling and linking programs.
> More information: <https://www.gnu.org/software/make/manual/make.html>.

- Build the default target:

`make`

- Build a specific target:

`make {{target}}`

- Build multiple targets:

`make {{target1}} {{target2}}`

- Build using a specific makefile:

`make {{[-f|--file]}} {{path/to/makefile}}`

- Build with parallel jobs:

`make -j{{4}}`

- Build without printing commands:

`make {{[-s|--silent]}}`

- Build and ignore errors:

`make {{[-i|--ignore-errors]}}`

- Dry run (print commands without executing):

`make {{[-n|--dry-run]}}`

- Print debugging information:

`make {{[-d|--debug]}}`

- Build with specific variables:

`make {{VARIABLE1}}={{value1}} {{VARIABLE2}}={{value2}}`