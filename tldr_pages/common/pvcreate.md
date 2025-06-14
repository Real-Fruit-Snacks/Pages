# pvcreate

> Create physical volumes for LVM.
> More information: <https://man7.org/linux/man-pages/man8/pvcreate.8.html>.

- Create a physical volume:

`sudo pvcreate {{/dev/sdX}}`

- Create physical volumes on multiple devices:

`sudo pvcreate {{/dev/sdX}} {{/dev/sdY}}`

- Create a physical volume on a partition:

`sudo pvcreate {{/dev/sdX1}}`

- Force creation (use with caution):

`sudo pvcreate -f {{/dev/sdX}}`

- Display progress:

`sudo pvcreate -v {{/dev/sdX}}`

- Set physical volume size:

`sudo pvcreate --setphysicalvolumesize {{100G}} {{/dev/sdX}}`

- Set metadata size:

`sudo pvcreate --metadatasize {{10M}} {{/dev/sdX}}`

- Check if device is already a physical volume:

`sudo pvck {{/dev/sdX}}`