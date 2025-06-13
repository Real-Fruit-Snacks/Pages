# curl

> Transfer data from or to a server.
> Supports most protocols including HTTP, FTP, and POP3.
> More information: <https://curl.se/docs/manpage.html>.

- Download a file to stdout:

`curl {{https://example.com/file}}`

- Download a file and save it with the filename from the URL:

`curl -O {{https://example.com/file.zip}}`

- Download a file and save it with a specific filename:

`curl -o {{filename}} {{https://example.com/file}}`

- Send form data (POST request):

`curl -d {{'name=value&name2=value2'}} {{https://example.com/form}}`

- Send JSON data with appropriate headers:

`curl -H "Content-Type: application/json" -d {{'{"key":"value"}'}} {{https://example.com/api}}`

- Follow redirects:

`curl -L {{https://example.com}}`

- Include HTTP headers in output:

`curl -i {{https://example.com}}`

- Pass a username and password for authentication:

`curl -u {{username}}:{{password}} {{https://example.com}}`