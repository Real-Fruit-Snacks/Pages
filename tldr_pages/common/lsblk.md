# lsblk

> List block devices in a tree-like format.
> More information: <https://man7.org/linux/man-pages/man8/lsblk.8.html>.

- List all block devices:

`lsblk`

- List all block devices including empty ones:

`lsblk -a`

- Display size information in bytes:

`lsblk -b`

- Display filesystem information:

`lsblk -f`

- Display permissions and ownership:

`lsblk -m`

- Display only specific columns:

`lsblk -o NAME,SIZE,TYPE,MOUNTPOINT`

- Display in JSON format:

`lsblk -J`

- Display only disks (no partitions):

`lsblk -d`

- Display topology information:

`lsblk -t`

- Exclude specific device types:

`lsblk -e {{7,11}}`