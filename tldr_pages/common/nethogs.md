# nethogs

> Monitor bandwidth usage per process.
> More information: <https://github.com/raboof/nethogs>.

- Monitor bandwidth usage (requires root):

`sudo nethogs`

- Monitor specific interface:

`sudo nethogs {{eth0}}`

- Monitor multiple interfaces:

`sudo nethogs {{eth0}} {{wlan0}}`

- Specify refresh delay in seconds:

`sudo nethogs -d {{5}}`

- Display bandwidth in KB/s:

`sudo nethogs -v {{1}}`

- Display bandwidth in MB/s:

`sudo nethogs -v {{2}}`

- Display processes even with no activity:

`sudo nethogs -a`

- Sort by sent traffic:

`sudo nethogs -s`