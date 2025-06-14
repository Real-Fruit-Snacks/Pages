# gdb

> GNU Debugger.
> More information: <https://www.gnu.org/software/gdb/>.

- Debug an executable:

`gdb {{executable}}`

- Attach to a running process:

`gdb -p {{pid}}`

- Debug a core dump:

`gdb {{executable}} {{core}}`

- Execute GDB commands from a file:

`gdb -x {{commands.gdb}} {{executable}}`

- Start debugging and break at main:

`gdb {{executable}} -ex "break main" -ex "run"`

- Common debugging commands:
  - run: Start the program
  - break: Set a breakpoint
  - continue: Continue execution
  - next: Step over
  - step: Step into
  - print: Print variable value
  - backtrace: Show call stack
  - quit: Exit GDB

`{{command}} while in GDB`