# pkill

> Send signals to processes matching a pattern.
> More information: <https://man7.org/linux/man-pages/man1/pkill.1.html>.

- Kill all processes matching a pattern:

`pkill {{pattern}}`

- Kill all processes matching a pattern (case-insensitive):

`pkill -i {{pattern}}`

- Kill all processes matching an exact command:

`pkill -x {{command}}`

- Send SIGTERM signal to matching processes:

`pkill -TERM {{pattern}}`

- Send SIGKILL signal to matching processes:

`pkill -KILL {{pattern}}`

- Kill processes of a specific user:

`pkill -u {{username}} {{pattern}}`

- Kill newest process matching pattern:

`pkill -n {{pattern}}`

- Kill oldest process matching pattern:

`pkill -o {{pattern}}`