# vmstat

> Report virtual memory statistics.
> More information: <https://man7.org/linux/man-pages/man8/vmstat.8.html>.

- Display virtual memory statistics:

`vmstat`

- Display memory statistics every N seconds:

`vmstat {{2}}`

- Display N reports with 1 second interval:

`vmstat 1 {{10}}`

- Display memory in megabytes:

`vmstat -S M`

- Display summary statistics:

`vmstat -s`

- Display disk statistics:

`vmstat -d`

- Display timestamps:

`vmstat -t`

- Display wide output:

`vmstat -w`