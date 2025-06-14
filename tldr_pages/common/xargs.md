# xargs

> Execute a command with arguments from standard input.
> More information: <https://man7.org/linux/man-pages/man1/xargs.1.html>.

- Run a command using input data as arguments:

`{{command}} | xargs {{command2}}`

- Run a command on each line of input:

`{{command}} | xargs -I {} {{command2}} {}`

- Delete all files matching a pattern:

`find . -name '{{*.backup}}' | xargs rm`

- Run a command with a specific number of arguments at a time:

`{{command}} | xargs -n {{arguments_per_command}} {{command2}}`

- Run a command in parallel with a maximum number of processes:

`{{command}} | xargs -P {{max_processes}} {{command2}}`

- Replace occurrences of a string with input data:

`{{command}} | xargs -I {} sh -c '{{command2}} "{}" > "{}.out"'`

- Preview commands without executing them:

`{{command}} | xargs {{[-p|--interactive]}} {{command2}}`

- Handle filenames with spaces by using null character as delimiter:

`find . -name '{{*.txt}}' -print0 | xargs -0 {{command2}}`