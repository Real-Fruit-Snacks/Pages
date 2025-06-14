# mdadm

> RAID management tool.
> More information: <https://man7.org/linux/man-pages/man8/mdadm.8.html>.

- Create a RAID array:

`sudo mdadm --create /dev/md0 --level={{5}} --raid-devices={{3}} {{/dev/sda1}} {{/dev/sdb1}} {{/dev/sdc1}}`

- Check RAID array status:

`sudo mdadm --detail {{/dev/md0}}`

- Check all arrays:

`sudo mdadm --detail --scan`

- Add a device to array:

`sudo mdadm --add {{/dev/md0}} {{/dev/sdd1}}`

- Remove a device from array:

`sudo mdadm --remove {{/dev/md0}} {{/dev/sdc1}}`

- Mark device as failed:

`sudo mdadm --fail {{/dev/md0}} {{/dev/sdc1}}`

- Stop an array:

`sudo mdadm --stop {{/dev/md0}}`

- Assemble an array:

`sudo mdadm --assemble {{/dev/md0}} {{/dev/sda1}} {{/dev/sdb1}}`