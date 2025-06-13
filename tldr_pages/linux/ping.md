# ping

> Send ICMP ECHO_REQUEST packets to network hosts.
> More information: <https://man7.org/linux/man-pages/man8/ping.8.html>.

- Ping a host:

`ping {{hostname}}`

- Ping a host a specific number of times:

`ping -c {{count}} {{hostname}}`

- Ping a host with a specific interval between requests (default is 1 second):

`ping -i {{seconds}} {{hostname}}`

- Ping a host without trying to lookup hostname:

`ping -n {{hostname}}`

- Ping a host and specify packet size in bytes:

`ping -s {{size}} {{hostname}}`

- Ping a host using a specific interface:

`ping -I {{interface}} {{hostname}}`

- Ping a host and print timestamps:

`ping -D {{hostname}}`

- Flood ping a host (requires root):

`sudo ping -f {{hostname}}`