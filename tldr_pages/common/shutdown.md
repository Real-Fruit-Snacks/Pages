# shutdown

> Shutdown the system.
> More information: <https://man7.org/linux/man-pages/man8/shutdown.8.html>.

- Shutdown immediately:

`sudo shutdown now`

- Shutdown at a specific time (24-hour format):

`sudo shutdown {{HH:MM}}`

- Shutdown in 30 minutes:

`sudo shutdown +30`

- Reboot instead of shutting down:

`sudo shutdown -r now`

- Shutdown with a custom message:

`sudo shutdown +10 "{{System going down for maintenance}}"`

- Cancel a scheduled shutdown:

`sudo shutdown -c`

- Shutdown without calling init (faster but less safe):

`sudo shutdown -n now`

- Halt the system (stop all CPUs):

`sudo shutdown -H now`

- Power off the system:

`sudo shutdown -P now`