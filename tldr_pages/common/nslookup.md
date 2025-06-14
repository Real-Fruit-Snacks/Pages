# nslookup

> Query Internet name servers interactively.
> More information: <https://man7.org/linux/man-pages/man1/nslookup.1.html>.

- Look up the IP address of a domain:

`nslookup {{example.com}}`

- Query a specific DNS server:

`nslookup {{example.com}} {{8.8.8.8}}`

- Perform a reverse DNS lookup:

`nslookup {{192.168.1.1}}`

- Look up a specific record type:

`nslookup -query={{A|AAAA|MX|TXT|NS}} {{example.com}}`

- Interactive mode:

`nslookup`

- Set the DNS server in interactive mode:

`server {{8.8.8.8}}`

- Change the default timeout:

`nslookup -timeout={{10}} {{example.com}}`

- Enable debug mode:

`nslookup -debug {{example.com}}`