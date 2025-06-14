# iftop

> Display bandwidth usage on network interfaces.
> More information: <http://www.ex-parrot.com/pdw/iftop/>.

- Display bandwidth usage (requires root):

`sudo iftop`

- Display bandwidth usage on a specific interface:

`sudo iftop -i {{eth0}}`

- Don't resolve hostnames:

`sudo iftop -n`

- Don't resolve port numbers:

`sudo iftop -N`

- Filter by source host:

`sudo iftop -f "src host {{192.168.1.100}}"`

- Filter by destination host:

`sudo iftop -f "dst host {{example.com}}"`

- Filter by port:

`sudo iftop -f "port {{80}}"`

- Sort by source address:

`sudo iftop -o source`