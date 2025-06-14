# top

> Display dynamic real-time information about running processes.
> More information: <https://man7.org/linux/man-pages/man1/top.1.html>.

- Start top:

`top`

- Do not show any idle or zombie processes:

`top -i`

- Show only processes owned by given user:

`top -u {{username}}`

- Sort processes by CPU usage:

`top -o %CPU`

- Sort processes by memory usage:

`top -o %MEM`

- Show only the processes with the given PIDs:

`top -p {{pid1,pid2,...}}`

- Show a specific number of lines:

`top -n {{number}}`

- Update display every N seconds:

`top -d {{seconds}}`