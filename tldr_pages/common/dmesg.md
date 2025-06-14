# dmesg

> Display kernel ring buffer messages.
> More information: <https://man7.org/linux/man-pages/man1/dmesg.1.html>.

- Display all kernel messages:

`dmesg`

- Display kernel messages with human-readable timestamps:

`dmesg -T`

- Display kernel messages and follow new ones:

`dmesg -w`

- Display only error and warning messages:

`dmesg --level={{err,warn}}`

- Display only messages from the last boot:

`dmesg -b`

- Clear the ring buffer:

`sudo dmesg -c`

- Display messages with color:

`dmesg --color={{always}}`

- Filter messages by facility:

`dmesg --facility={{kern|user|daemon}}`

- Search for specific text:

`dmesg | grep "{{search_term}}"`

- Display messages from the last N seconds:

`dmesg -T | grep "$(date '+%b %d' -d '{{60}} seconds ago')"` 