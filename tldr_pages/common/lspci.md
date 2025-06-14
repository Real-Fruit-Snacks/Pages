# lspci

> List all PCI devices.
> More information: <https://man7.org/linux/man-pages/man8/lspci.8.html>.

- List all PCI devices:

`lspci`

- List all PCI devices with verbose information:

`lspci -v`

- List all PCI devices with very verbose information:

`lspci -vv`

- List all PCI devices in tree view:

`lspci -t`

- Show numeric IDs:

`lspci -nn`

- Show kernel drivers and modules:

`lspci -k`

- Show a specific device by slot:

`lspci -s {{00:01.0}}`

- Show devices of a specific class:

`lspci -d ::{{0300}}`