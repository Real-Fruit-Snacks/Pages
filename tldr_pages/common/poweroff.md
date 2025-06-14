# poweroff

> Power off the system.
> More information: <https://man7.org/linux/man-pages/man8/poweroff.8.html>.

- Power off immediately:

`sudo poweroff`

- Force immediate power off:

`sudo poweroff -f`

- Halt the system without powering off:

`sudo poweroff --halt`

- Power off without calling init:

`sudo poweroff -n`

- Power off without syncing filesystems:

`sudo poweroff -d`

- Write wtmp shutdown entry only:

`sudo poweroff -w`

- Power off with verbose messages:

`sudo poweroff --verbose`

- Cancel a scheduled power off:

`sudo shutdown -c`