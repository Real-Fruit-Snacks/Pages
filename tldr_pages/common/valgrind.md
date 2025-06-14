# valgrind

> Memory error detector and profiler.
> More information: <https://valgrind.org/>.

- Check for memory errors:

`valgrind {{program}}`

- Check for memory errors with detailed output:

`valgrind --leak-check=full {{program}}`

- Check for memory errors and show reachable blocks:

`valgrind --leak-check=full --show-reachable=yes {{program}}`

- Check for memory errors and track origins:

`valgrind --track-origins=yes {{program}}`

- Profile cache usage:

`valgrind --tool=cachegrind {{program}}`

- Profile heap usage:

`valgrind --tool=massif {{program}}`

- Check for threading errors:

`valgrind --tool=helgrind {{program}}`

- Generate suppression file:

`valgrind --gen-suppressions=all {{program}}`