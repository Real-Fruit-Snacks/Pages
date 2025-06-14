# lsusb

> Display information about USB buses and devices connected to them.
> More information: <https://man7.org/linux/man-pages/man8/lsusb.8.html>.

- List all USB devices:

`lsusb`

- List all USB devices with verbose information:

`lsusb -v`

- List all USB devices in tree view:

`lsusb -t`

- List USB devices by vendor and product ID:

`lsusb -d {{vendor_id}}:{{product_id}}`

- List devices on a specific bus:

`lsusb -s {{bus}}:{{device}}`

- Show only devices on a specific bus:

`lsusb -s {{bus}}:`

- Show physical USB device hierarchy as a tree:

`lsusb -tv`

- List all USB devices with detailed information:

`lsusb -v | less`