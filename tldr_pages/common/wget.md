# wget

> Download files from the web.
> Supports HTTP, HTTPS, and FTP.
> More information: <https://www.gnu.org/software/wget/manual/wget.html>.

- Download a file to the current directory:

`wget {{https://example.com/file}}`

- Download a file and save it with a specific filename:

`wget -O {{filename}} {{https://example.com/file}}`

- Download a file to a specific directory:

`wget -P {{/path/to/directory}} {{https://example.com/file}}`

- Continue a partial download:

`wget -c {{https://example.com/largefile}}`

- Download all files from a directory listing:

`wget -r -np -nd {{https://example.com/directory/}}`

- Limit download speed:

`wget --limit-rate={{200k}} {{https://example.com/file}}`

- Download using a specific user agent:

`wget --user-agent="{{Mozilla/5.0}}" {{https://example.com/file}}`

- Download with username and password:

`wget --user={{username}} --password={{password}} {{https://example.com/file}}`