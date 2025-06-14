# pgrep

> Find process IDs matching a pattern.
> More information: <https://man7.org/linux/man-pages/man1/pgrep.1.html>.

- Find process IDs matching a pattern:

`pgrep {{pattern}}`

- Find process IDs matching a pattern (case-insensitive):

`pgrep -i {{pattern}}`

- Find process IDs matching an exact command:

`pgrep -x {{command}}`

- Find process IDs matching a pattern and show process names:

`pgrep -l {{pattern}}`

- Find process IDs of a specific user:

`pgrep -u {{username}} {{pattern}}`

- Find process IDs matching multiple patterns:

`pgrep -f "{{pattern1|pattern2}}"`

- Find newest process matching pattern:

`pgrep -n {{pattern}}`

- Find oldest process matching pattern:

`pgrep -o {{pattern}}`