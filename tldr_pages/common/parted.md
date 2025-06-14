# parted

> Partition manipulation program.
> More information: <https://www.gnu.org/software/parted/>.

- List partitions on all devices:

`sudo parted --list`

- Start interactive mode on a device:

`sudo parted {{/dev/sdX}}`

- Create a new partition table:

`sudo parted {{/dev/sdX}} mklabel {{gpt}}`

- Create a partition:

`sudo parted {{/dev/sdX}} mkpart {{primary}} {{ext4}} {{1MiB}} {{100GiB}}`

- Resize a partition:

`sudo parted {{/dev/sdX}} resizepart {{1}} {{150GiB}}`

- Remove a partition:

`sudo parted {{/dev/sdX}} rm {{1}}`

- Print partition table:

`sudo parted {{/dev/sdX}} print`

- Set partition flag:

`sudo parted {{/dev/sdX}} set {{1}} {{boot}} on`