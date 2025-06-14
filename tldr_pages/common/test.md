# test

> Check file types and compare values.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/test-invocation.html>.

- Check if a file exists:

`test -e {{path/to/file}}`

- Check if a file is a regular file:

`test -f {{path/to/file}}`

- Check if a path is a directory:

`test -d {{path/to/directory}}`

- Check if a string is empty:

`test -z "{{string}}"`

- Check if a string is not empty:

`test -n "{{string}}"`

- Check if strings are equal:

`test "{{string1}}" = "{{string2}}"`

- Check if a number is equal/not equal/greater/less than another:

`test {{number1}} {{-eq|-ne|-gt|-lt}} {{number2}}`

- Check if a file is newer/older than another:

`test {{file1}} {{-nt|-ot}} {{file2}}`

- Check multiple conditions with AND/OR:

`test {{condition1}} {{[-a|&&]}} {{condition2}}`
`test {{condition1}} {{[-o|||]}} {{condition2}}`