# kill

> Send signals to processes, usually to stop them.
> More information: <https://man7.org/linux/man-pages/man1/kill.1.html>.

- Terminate a process using the default TERM signal:

`kill {{PID}}`

- Terminate multiple processes:

`kill {{PID1 PID2 PID3}}`

- List available signal names:

`kill -l`

- Terminate a process using the KILL signal (cannot be caught or ignored):

`kill -9 {{PID}}`

- Terminate a process using the HUP signal (often used to reload configuration):

`kill -HUP {{PID}}`

- Send a custom signal to a process:

`kill -{{signal_number}} {{PID}}`

- Terminate all processes with a specific name:

`kill -9 $(pgrep {{process_name}})`

- Send CONT signal to resume a stopped process:

`kill -CONT {{PID}}`