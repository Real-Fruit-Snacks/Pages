# netstat

> Display network connections, routing tables, interface statistics, masquerade connections, and multicast memberships.
> More information: <https://man7.org/linux/man-pages/man8/netstat.8.html>.

- List all listening and non-listening TCP connections:

`netstat {{[-a|--all]}} {{[-t|--tcp]}}`

- List all listening TCP ports:

`netstat {{[-l|--listening]}} {{[-t|--tcp]}}`

- List all listening and non-listening UDP connections:

`netstat {{[-a|--all]}} {{[-u|--udp]}}`

- Show network statistics:

`netstat {{[-s|--statistics]}}`

- Show the routing table:

`netstat {{[-r|--route]}}`

- Display connections with PIDs and program names:

`netstat {{[-p|--program]}}`

- Display connections continuously:

`netstat {{[-c|--continuous]}}`

- Display numerical addresses instead of resolving hosts:

`netstat {{[-n|--numeric]}}`

- Display all network interfaces:

`netstat {{[-i|--interfaces]}}`

- Display listening ports with their PID and program:

`sudo netstat {{[-tlnp|--tcp --listening --numeric --program]}}`