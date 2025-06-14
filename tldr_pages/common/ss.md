# ss

> Display socket statistics.
> More information: <https://man7.org/linux/man-pages/man8/ss.8.html>.

- Show all TCP and UDP ports:

`ss -a -t -u`

- Show all TCP ports (sockets) that are listening:

`ss -l -t`

- Show all ports with process information:

`sudo ss -l -p`

- Show all TCP connections:

`ss -t -a`

- Show all listening ports with numeric values:

`ss -l -n`

- Show summary statistics:

`ss -s`

- List all established SSH connections:

`ss -o state established '( dport = :22 or sport = :22 )'`

- Filter by destination port:

`ss -nt dst :{{443}}`