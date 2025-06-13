# sudo

> Execute a command as another user (usually root).
> More information: <https://man7.org/linux/man-pages/man8/sudo.8.html>.

- Run a command as root:

`sudo {{command}}`

- Edit a file as root with the default editor:

`sudo -e {{/path/to/file}}`

- Run a command as another user:

`sudo -u {{user}} {{command}}`

- Run a command as another user and group:

`sudo -u {{user}} -g {{group}} {{command}}`

- Start an interactive shell as root:

`sudo -i`

- Start an interactive shell as another user:

`sudo -u {{user}} -i`

- List allowed (and forbidden) commands for the current user:

`sudo -l`

- Run a command with environment variables from the current session:

`sudo -E {{command}}`