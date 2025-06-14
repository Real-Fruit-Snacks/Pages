# lshw

> List hardware configuration.
> More information: <https://linux.die.net/man/1/lshw>.

- Display all hardware information:

`sudo lshw`

- Display hardware in short format:

`sudo lshw -short`

- Display only memory information:

`sudo lshw -class memory`

- Display only CPU information:

`sudo lshw -class processor`

- Display only network devices:

`sudo lshw -class network`

- Display only storage devices:

`sudo lshw -class disk`

- Display output as HTML:

`sudo lshw -html > {{hardware.html}}`

- Display output as XML:

`sudo lshw -xml`