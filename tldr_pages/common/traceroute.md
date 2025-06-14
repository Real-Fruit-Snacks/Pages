# traceroute

> Trace the route packets take to a network host.
> More information: <https://man7.org/linux/man-pages/man8/traceroute.8.html>.

- Trace route to a host:

`traceroute {{example.com}}`

- Disable IP address to hostname mapping:

`traceroute -n {{example.com}}`

- Specify maximum number of hops:

`traceroute -m {{30}} {{example.com}}`

- Specify wait time for response:

`traceroute -w {{1}} {{example.com}}`

- Use ICMP instead of UDP:

`traceroute -I {{example.com}}`

- Use TCP SYN for probes:

`traceroute -T {{example.com}}`

- Specify source address:

`traceroute -s {{192.168.1.100}} {{example.com}}`

- Use a specific port:

`traceroute -p {{53}} {{example.com}}`