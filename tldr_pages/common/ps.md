# ps

> Display information about running processes.
> More information: <https://man7.org/linux/man-pages/man1/ps.1.html>.

- List all running processes:

`ps aux`

- List all running processes including the full command string:

`ps auxww`

- Search for a process that matches a string:

`ps aux | grep {{string}}`

- List all processes of the current user in extra full format:

`ps --user $(whoami) -F`

- List all processes of the current user as a tree:

`ps --user $(whoami) f`

- Get the parent PID of a process:

`ps -o ppid= -p {{pid}}`

- List processes sorted by memory usage:

`ps aux --sort={{[-]%mem}}`

- List processes sorted by CPU usage:

`ps aux --sort={{[-]%cpu}}`