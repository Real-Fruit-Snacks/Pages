# ifconfig

> Configure a network interface.
> More information: <https://man7.org/linux/man-pages/man8/ifconfig.8.html>.

- Display information about all network interfaces:

`ifconfig`

- Display information about a specific interface:

`ifconfig {{eth0}}`

- Enable an interface:

`ifconfig {{eth0}} up`

- Disable an interface:

`ifconfig {{eth0}} down`

- Assign an IP address to an interface:

`ifconfig {{eth0}} {{192.168.1.100}}`

- Assign an IP address and netmask to an interface:

`ifconfig {{eth0}} {{192.168.1.100}} netmask {{255.255.255.0}}`

- Change the MAC address of an interface:

`ifconfig {{eth0}} hw ether {{00:11:22:33:44:55}}`

- Add an alias IP address to an interface:

`ifconfig {{eth0:0}} {{192.168.1.101}}`

- Enable promiscuous mode on an interface:

`ifconfig {{eth0}} promisc`

- Disable promiscuous mode on an interface:

`ifconfig {{eth0}} -promisc`