# cut

> Extract sections from each line of input.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/cut-invocation.html>.

- Extract specific characters from each line:

`cut -c {{1-5}} {{file}}`

- Extract specific fields (columns) using a delimiter:

`cut -d'{{,}}' -f{{1,3}} {{file}}`

- Extract a range of fields:

`cut -d'{{:}}' -f{{1-3}} {{file}}`

- Extract everything from a field to the end of the line:

`cut -d'{{ }}' -f{{2-}} {{file}}`

- Extract fields from standard input:

`echo {{"hello:world"}} | cut -d'{{:}}' -f{{2}}`

- Use a different output delimiter:

`cut -d'{{,}}' -f{{1,3}} --output-delimiter='{{|}}' {{file}}`

- Extract bytes instead of characters:

`cut -b {{1-5}} {{file}}`

- Suppress lines without delimiter:

`cut -d'{{,}}' -f{{1}} -s {{file}}`