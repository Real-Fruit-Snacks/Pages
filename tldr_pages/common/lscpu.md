# lscpu

> Display information about the CPU architecture.
> More information: <https://man7.org/linux/man-pages/man1/lscpu.1.html>.

- Display information about all CPUs:

`lscpu`

- Display information in a table:

`lscpu --extended`

- Display only the offline CPUs:

`lscpu --offline`

- Display only the online CPUs:

`lscpu --online`

- Display in JSON format:

`lscpu --json`

- Display in parseable format:

`lscpu --parse`

- Display CPU architecture in human-readable format:

`lscpu --human`

- Display extended readable format with CPU vulnerabilities:

`lscpu --extended --all`