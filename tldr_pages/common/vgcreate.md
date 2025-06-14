# vgcreate

> Create volume groups for LVM.
> More information: <https://man7.org/linux/man-pages/man8/vgcreate.8.html>.

- Create a volume group:

`sudo vgcreate {{vg_name}} {{/dev/sdX}}`

- Create a volume group with multiple physical volumes:

`sudo vgcreate {{vg_name}} {{/dev/sdX}} {{/dev/sdY}}`

- Create with specific physical extent size:

`sudo vgcreate -s {{32M}} {{vg_name}} {{/dev/sdX}}`

- Create with specific metadata size:

`sudo vgcreate --metadatasize {{10M}} {{vg_name}} {{/dev/sdX}}`

- Display progress:

`sudo vgcreate -v {{vg_name}} {{/dev/sdX}}`

- Set maximum logical volumes:

`sudo vgcreate -l {{100}} {{vg_name}} {{/dev/sdX}}`

- Set maximum physical volumes:

`sudo vgcreate -p {{10}} {{vg_name}} {{/dev/sdX}}`

- Force creation:

`sudo vgcreate -f {{vg_name}} {{/dev/sdX}}`