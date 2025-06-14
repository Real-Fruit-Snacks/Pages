# mkfs

> Build a filesystem on a device.
> More information: <https://man7.org/linux/man-pages/man8/mkfs.8.html>.

- Build an ext4 filesystem:

`sudo mkfs.ext4 {{/dev/sdXY}}`

- Build an ext3 filesystem:

`sudo mkfs.ext3 {{/dev/sdXY}}`

- Build a FAT32 filesystem:

`sudo mkfs.vfat -F 32 {{/dev/sdXY}}`

- Build an NTFS filesystem:

`sudo mkfs.ntfs {{/dev/sdXY}}`

- Build an XFS filesystem:

`sudo mkfs.xfs {{/dev/sdXY}}`

- Build a filesystem with a label:

`sudo mkfs.ext4 -L "{{label}}" {{/dev/sdXY}}`

- Build a filesystem with specific block size:

`sudo mkfs.ext4 -b {{4096}} {{/dev/sdXY}}`

- Check for bad blocks before building:

`sudo mkfs.ext4 -c {{/dev/sdXY}}`