# fdisk

> Manipulate disk partition tables.
> More information: <https://man7.org/linux/man-pages/man8/fdisk.8.html>.

- List all partitions:

`sudo fdisk -l`

- List partitions of a specific disk:

`sudo fdisk -l {{/dev/sda}}`

- Start interactive mode for a disk:

`sudo fdisk {{/dev/sda}}`

- Create a new partition (in interactive mode):

`n`

- Delete a partition (in interactive mode):

`d`

- Change partition type (in interactive mode):

`t`

- Print partition table (in interactive mode):

`p`

- Write changes and exit (in interactive mode):

`w`

- Quit without saving changes (in interactive mode):

`q`

- Display help (in interactive mode):

`m`