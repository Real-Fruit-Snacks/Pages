# yes

> Output a string repeatedly until killed.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/yes-invocation.html>.

- Output "y" repeatedly:

`yes`

- Output a specific string repeatedly:

`yes "{{string}}"`

- Output "n" repeatedly:

`yes n`

- Pipe yes to a command that expects confirmation:

`yes | {{command}}`

- Answer "no" to all prompts:

`yes n | {{command}}`

- Generate a large file filled with a string:

`yes "{{string}}" | head -c {{1000000}} > {{file}}`

- Stress test CPU by piping to a command:

`yes > /dev/null`

- Repeatedly append a string to a file:

`yes "{{string}}" | head -n {{100}} >> {{file}}`