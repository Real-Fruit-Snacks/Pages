# ps

> Display information about running processes.
> More information: <https://man7.org/linux/man-pages/man1/ps.1.html>.

- List all running processes:

`ps aux`

- List all running processes in a full-format listing:

`ps auxf`

- List all processes owned by current user:

`ps -u $(whoami)`

- List all processes owned by a specific user:

`ps -u {{username}}`

- Show process tree:

`ps -ef --forest`

- Get process info by PID:

`ps -p {{PID}}`

- Sort processes by memory usage:

`ps aux --sort=-%mem`

- Sort processes by CPU usage:

`ps aux --sort=-%cpu`