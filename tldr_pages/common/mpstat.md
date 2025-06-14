# mpstat

> Report processor statistics.
> More information: <https://man7.org/linux/man-pages/man1/mpstat.1.html>.

- Display CPU statistics:

`mpstat`

- Display statistics for all CPUs:

`mpstat -P ALL`

- Display statistics for specific CPU:

`mpstat -P {{0}}`

- Display statistics every N seconds:

`mpstat {{2}}`

- Display N reports with 1 second interval:

`mpstat 1 {{10}}`

- Display interrupt statistics:

`mpstat -I ALL`

- Display statistics in JSON format:

`mpstat -o JSON`

- Display extended statistics:

`mpstat -A`