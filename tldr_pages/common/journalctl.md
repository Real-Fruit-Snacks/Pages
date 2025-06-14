# journalctl

> Query the systemd journal.
> More information: <https://www.freedesktop.org/software/systemd/man/journalctl.html>.

- Show all messages with priority level 3 (errors) from this boot:

`journalctl -b -p 3`

- Show all messages from last boot:

`journalctl -b -1`

- Follow new messages (like tail -f):

`journalctl -f`

- Show all messages by a specific unit:

`journalctl -u {{unit_name}}`

- Show messages for the current boot and a specific unit:

`journalctl -b -u {{unit_name}}`

- Show kernel messages:

`journalctl -k`

- Show messages newer than a specific date and time:

`journalctl --since="{{2023-01-01 12:00:00}}"`

- Show messages between two timestamps:

`journalctl --since="{{2023-01-01}}" --until="{{2023-01-02}}"`

- Show messages in reverse order (newest first):

`journalctl -r`

- Show only the last N lines:

`journalctl -n {{50}}`

- Show messages in JSON format:

`journalctl -o json`