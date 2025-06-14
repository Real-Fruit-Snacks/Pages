# halt

> Halt the system.
> More information: <https://man7.org/linux/man-pages/man8/halt.8.html>.

- Halt the system immediately:

`sudo halt`

- Force immediate halt:

`sudo halt -f`

- Power off after halting:

`sudo halt -p`

- Halt without calling init:

`sudo halt -n`

- Halt without syncing filesystems:

`sudo halt -d`

- Write wtmp shutdown entry only:

`sudo halt -w`

- Halt with verbose messages:

`sudo halt --verbose`

- Halt and leave a message in the logs:

`sudo halt -m "{{System halted for maintenance}}"`