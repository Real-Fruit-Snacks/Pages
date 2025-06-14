# ip

> Show and manipulate routing, network devices, interfaces and tunnels.
> More information: <https://man7.org/linux/man-pages/man8/ip.8.html>.

- Show all network interfaces:

`ip addr`

- Show details of a specific interface:

`ip addr show {{eth0}}`

- Add an IP address to an interface:

`sudo ip addr add {{192.168.1.100/24}} dev {{eth0}}`

- Remove an IP address from an interface:

`sudo ip addr del {{192.168.1.100/24}} dev {{eth0}}`

- Show the routing table:

`ip route`

- Add a default route:

`sudo ip route add default via {{192.168.1.1}}`

- Add a static route:

`sudo ip route add {{192.168.2.0/24}} via {{192.168.1.1}} dev {{eth0}}`

- Enable an interface:

`sudo ip link set {{eth0}} up`

- Disable an interface:

`sudo ip link set {{eth0}} down`

- Show ARP cache:

`ip neigh`

- Monitor network events:

`ip monitor`