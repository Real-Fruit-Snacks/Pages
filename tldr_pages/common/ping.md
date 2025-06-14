# ping

> Send ICMP ECHO_REQUEST packets to network hosts.
> More information: <https://man7.org/linux/man-pages/man8/ping.8.html>.

- Ping a host:

`ping {{hostname_or_ip}}`

- Ping a host a specific number of times:

`ping {{[-c|--count]}} {{count}} {{hostname_or_ip}}`

- Ping a host, specifying the interval between requests (default is 1 second):

`ping {{[-i|--interval]}} {{seconds}} {{hostname_or_ip}}`

- Ping a host without trying to lookup symbolic names for addresses:

`ping {{[-n|--numeric]}} {{hostname_or_ip}}`

- Ping a host and ring the bell when a packet is received:

`ping {{[-a|--audible]}} {{hostname_or_ip}}`

- Ping a host showing only summary statistics:

`ping {{[-q|--quiet]}} {{hostname_or_ip}}`

- Ping a host with a specific packet size:

`ping {{[-s|--packetsize]}} {{packet_size}} {{hostname_or_ip}}`

- Ping a host, flooding it with requests (requires root):

`sudo ping {{[-f|--flood]}} {{hostname_or_ip}}`