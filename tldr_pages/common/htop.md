# htop

> Interactive process viewer.
> More information: <https://htop.dev/>.

- Start htop:

`htop`

- Start htop with a specific user's processes:

`htop --user {{username}}`

- Sort processes by a specific column (use F6 to choose column interactively):

`htop --sort-key {{COLUMN}}`

- Start htop in monochrome mode:

`htop -C`

- Display processes in tree view:

`htop -t`

- Display processes of a specific PID:

`htop --pid {{pid1,pid2,...}}`

- Set update interval (in tenths of seconds):

`htop -d {{10}}`

- Interactive commands:
  - F1/h: Help
  - F2/S: Setup
  - F3/Slash: Search
  - F4/Backslash: Filter
  - F5/t: Tree view
  - F6/</>: Sort
  - F9/k: Kill process
  - F10/q: Quit

`<key> while running htop`