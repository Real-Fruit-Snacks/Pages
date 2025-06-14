# lvcreate

> Create logical volumes in LVM.
> More information: <https://man7.org/linux/man-pages/man8/lvcreate.8.html>.

- Create a logical volume of 10GB:

`sudo lvcreate -L {{10G}} -n {{lv_name}} {{vg_name}}`

- Create a logical volume using 50% of volume group:

`sudo lvcreate -l {{50%VG}} -n {{lv_name}} {{vg_name}}`

- Create a logical volume using all free space:

`sudo lvcreate -l {{100%FREE}} -n {{lv_name}} {{vg_name}}`

- Create a thin pool:

`sudo lvcreate -L {{10G}} --thinpool {{pool_name}} {{vg_name}}`

- Create a thin volume:

`sudo lvcreate -V {{5G}} --thin -n {{lv_name}} {{vg_name}}/{{pool_name}}`

- Create a snapshot:

`sudo lvcreate -s -L {{1G}} -n {{snapshot_name}} {{vg_name}}/{{lv_name}}`

- Create a mirrored volume:

`sudo lvcreate -m {{1}} -L {{10G}} -n {{lv_name}} {{vg_name}}`

- Create a striped volume:

`sudo lvcreate -i {{2}} -I {{64}} -L {{10G}} -n {{lv_name}} {{vg_name}}`