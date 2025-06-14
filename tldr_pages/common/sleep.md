# sleep

> Delay for a specified amount of time.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/sleep-invocation.html>.

- Delay for 5 seconds:

`sleep 5`

- Delay for 0.5 seconds:

`sleep 0.5`

- Delay for 1 minute:

`sleep 1m`

- Delay for 1 hour:

`sleep 1h`

- Delay for 1 day:

`sleep 1d`

- Delay for multiple time units:

`sleep 1h 30m`

- Use in a loop to run a command every 10 seconds:

`while true; do {{command}}; sleep 10; done`

- Countdown timer:

`for i in {10..1}; do echo $i; sleep 1; done; echo "Time's up!"`