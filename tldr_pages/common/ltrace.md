# ltrace

> Trace library calls.
> More information: <https://man7.org/linux/man-pages/man1/ltrace.1.html>.

- Trace library calls:

`ltrace {{program}}`

- Trace calls to a specific library:

`ltrace -l {{libname.so}} {{program}}`

- Count library calls:

`ltrace -c {{program}}`

- Trace child processes:

`ltrace -f {{program}}`

- Attach to running process:

`ltrace -p {{pid}}`

- Display timestamps:

`ltrace -t {{program}}`

- Display return values:

`ltrace -s {{100}} {{program}}`

- Output to file:

`ltrace -o {{output.txt}} {{program}}`