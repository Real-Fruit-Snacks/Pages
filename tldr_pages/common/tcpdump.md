# tcpdump

> Dump traffic on a network.
> More information: <https://www.tcpdump.org/manpages/tcpdump.1.html>.

- Capture packets on a specific interface:

`sudo tcpdump -i {{eth0}}`

- Capture only N packets:

`sudo tcpdump -c {{100}}`

- Save captured packets to a file:

`sudo tcpdump -w {{capture.pcap}}`

- Read packets from a file:

`tcpdump -r {{capture.pcap}}`

- Capture packets from/to a specific host:

`sudo tcpdump host {{192.168.1.100}}`

- Capture packets on a specific port:

`sudo tcpdump port {{80}}`

- Capture only TCP packets:

`sudo tcpdump tcp`

- Display packet contents in ASCII:

`sudo tcpdump -A`

- Display packet contents in hex and ASCII:

`sudo tcpdump -XX`

- Don't resolve hostnames or port names:

`sudo tcpdump -nn`