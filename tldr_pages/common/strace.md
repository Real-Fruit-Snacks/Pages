# strace

> Trace system calls and signals.
> More information: <https://man7.org/linux/man-pages/man1/strace.1.html>.

- Trace a program:

`strace {{program}}`

- Trace a running process:

`strace -p {{pid}}`

- Trace a program and filter by system call:

`strace -e {{open,close}} {{program}}`

- Count system calls:

`strace -c {{program}}`

- Trace only network-related system calls:

`strace -e trace=network {{program}}`

- Trace only file-related system calls:

`strace -e trace=file {{program}}`

- Trace a program and its child processes:

`strace -f {{program}}`

- Output to a file:

`strace -o {{output.txt}} {{program}}`