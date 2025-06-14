# su

> Switch to another user.
> More information: <https://man7.org/linux/man-pages/man1/su.1.html>.

- Switch to another user:

`su {{username}}`

- Switch to root user:

`su`

- Switch to another user with login shell:

`su - {{username}}`

- Switch to root with login shell:

`su -`

- Execute a command as another user:

`su -c "{{command}}" {{username}}`

- Switch to another user with a specific shell:

`su -s {{/bin/bash}} {{username}}`

- Switch to another user preserving environment variables:

`su -m {{username}}`

- Switch to another user in a specific directory:

`su - {{username}} -c "cd {{/path/to/directory}} && {{command}}"`