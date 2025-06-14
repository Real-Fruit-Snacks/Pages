# sar

> System Activity Reporter.
> More information: <https://man7.org/linux/man-pages/man1/sar.1.html>.

- Display CPU usage for the current day:

`sar`

- Display CPU usage every N seconds:

`sar {{2}}`

- Display CPU usage for N iterations:

`sar {{2}} {{10}}`

- Display memory usage:

`sar -r`

- Display network statistics:

`sar -n DEV`

- Display disk I/O:

`sar -d`

- Display historical data from a specific date:

`sar -f {{/var/log/sa/sa01}}`

- Display all statistics:

`sar -A`