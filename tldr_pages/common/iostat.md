# iostat

> Report I/O statistics.
> More information: <https://man7.org/linux/man-pages/man1/iostat.1.html>.

- Display I/O and CPU statistics:

`iostat`

- Display statistics every N seconds:

`iostat {{2}}`

- Display N reports with 1 second interval:

`iostat 1 {{10}}`

- Display extended statistics:

`iostat -x`

- Display CPU statistics only:

`iostat -c`

- Display device statistics only:

`iostat -d`

- Display statistics in megabytes:

`iostat -m`

- Display statistics for specific devices:

`iostat -p {{sda}}`