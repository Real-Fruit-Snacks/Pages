# dig

> DNS lookup utility.
> More information: <https://man7.org/linux/man-pages/man1/dig.1.html>.

- Look up the IP address of a domain:

`dig {{example.com}}`

- Look up a specific record type:

`dig {{example.com}} {{A|AAAA|MX|TXT|NS|CNAME}}`

- Query a specific DNS server:

`dig @{{8.8.8.8}} {{example.com}}`

- Perform a reverse DNS lookup:

`dig -x {{192.168.1.1}}`

- Show only the answer section:

`dig {{example.com}} +short`

- Show detailed trace of the query:

`dig {{example.com}} +trace`

- Query without using the local cache:

`dig {{example.com}} +nocmd +noall +answer`

- Batch mode - read domains from a file:

`dig -f {{path/to/domains.txt}}`

- Display all DNS records:

`dig {{example.com}} ANY`