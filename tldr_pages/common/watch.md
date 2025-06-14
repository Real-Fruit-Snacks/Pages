# watch

> Execute a command repeatedly and monitor the output.
> More information: <https://man7.org/linux/man-pages/man1/watch.1.html>.

- Monitor a command every 2 seconds:

`watch {{command}}`

- Monitor a command with a custom interval:

`watch -n {{seconds}} {{command}}`

- Monitor a command and highlight differences:

`watch -d {{command}}`

- Monitor a command and exit on change:

`watch -g {{command}}`

- Monitor a command without showing the title header:

`watch -t {{command}}`

- Monitor a command and beep if it returns non-zero:

`watch -b {{command}}`

- Monitor disk space usage:

`watch df -h`

- Monitor memory usage:

`watch free -h`

- Monitor a log file:

`watch tail {{/var/log/syslog}}`