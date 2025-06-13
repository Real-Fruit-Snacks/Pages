# top

> Display dynamic real-time information about running processes.
> More information: <https://man7.org/linux/man-pages/man1/top.1.html>.

- Start top:

`top`

- Show only processes owned by a specific user:

`top -u {{username}}`

- Sort processes by CPU usage:

`top -o %CPU`

- Sort processes by memory usage:

`top -o %MEM`

- Show only processes with a specific PID:

`top -p {{PID}}`

- Display help about interactive commands:

`top -h`

- Toggle between CPU usage values and percentages:

`top` (then press `Shift + I`)

- Change update interval to 1 second:

`top -d 1`