# sed

> Stream editor for filtering and transforming text.
> More information: <https://www.gnu.org/software/sed/manual/sed.html>.

- Replace the first occurrence of a string in a file:

`sed 's/{{find}}/{{replace}}/' {{path/to/file}}`

- Replace all occurrences of a string in a file:

`sed 's/{{find}}/{{replace}}/g' {{path/to/file}}`

- Replace all occurrences of a string in a file, and overwrite the file:

`sed -i 's/{{find}}/{{replace}}/g' {{path/to/file}}`

- Replace only on lines matching a pattern:

`sed '/{{pattern}}/s/{{find}}/{{replace}}/g' {{path/to/file}}`

- Delete lines matching a pattern:

`sed '/{{pattern}}/d' {{path/to/file}}`

- Print only lines matching a pattern:

`sed -n '/{{pattern}}/p' {{path/to/file}}`

- Replace strings using regular expressions:

`sed -E 's/{{regex}}/{{replace}}/g' {{path/to/file}}`

- Insert a line before/after a pattern match:

`sed '/{{pattern}}/i\{{text to insert before}}' {{path/to/file}}`
`sed '/{{pattern}}/a\{{text to insert after}}' {{path/to/file}}`