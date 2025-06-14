# hostname

> Show or set the system's hostname.
> More information: <https://man7.org/linux/man-pages/man1/hostname.1.html>.

- Show current hostname:

`hostname`

- Show the fully qualified domain name (FQDN):

`hostname {{[-f|--fqdn]}}`

- Show the network address of the host:

`hostname {{[-i|--ip-address]}}`

- Show all network addresses of the host:

`hostname {{[-I|--all-ip-addresses]}}`

- Show the domain name:

`hostname {{[-d|--domain]}}`

- Show the short hostname:

`hostname {{[-s|--short]}}`

- Set the hostname (requires root):

`sudo hostname {{new_hostname}}`

- Set the hostname from a file (requires root):

`sudo hostname {{[-F|--file]}} {{path/to/hostname_file}}`