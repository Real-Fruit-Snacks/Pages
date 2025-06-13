# lsof

> List open files and the processes that opened them.
> More information: <https://man7.org/linux/man-pages/man8/lsof.8.html>.

- List all open files:

`sudo lsof`

- Find processes that have a given file open:

`lsof {{/path/to/file}}`

- List open files by user:

`lsof -u {{username}}`

- List open files by process ID:

`lsof -p {{PID}}`

- List files opened by processes on a specific port:

`lsof -i :{{port}}`

- List files opened by processes using a specific protocol on a port:

`lsof -i {{tcp}}:{{80}}`

- List all network connections:

`lsof -i`

- List processes using a specific mount point:

`lsof {{/mnt/mount_point}}`

- Kill all processes accessing a specific file:

`kill -9 $(lsof -t {{/path/to/file}})`