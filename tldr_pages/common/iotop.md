# iotop

> Display I/O usage by processes.
> More information: <http://guichaz.free.fr/iotop/>.

- Display I/O usage (requires root):

`sudo iotop`

- Display only processes doing I/O:

`sudo iotop --only`

- Display accumulated I/O instead of bandwidth:

`sudo iotop --accumulated`

- Display I/O in non-interactive mode:

`sudo iotop --batch`

- Display only processes of a specific PID:

`sudo iotop --pid={{pid}}`

- Display I/O for processes owned by a user:

`sudo iotop --user={{username}}`

- Display processes in kilobytes:

`sudo iotop --kilobytes`

- Sort by a column (use left/right arrows to change):

`sudo iotop --sort={{column}}`