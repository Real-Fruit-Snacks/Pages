# blkid

> Locate/print block device attributes.
> More information: <https://man7.org/linux/man-pages/man8/blkid.8.html>.

- List all block devices with their attributes:

`sudo blkid`

- Display information about a specific device:

`sudo blkid {{/dev/sda1}}`

- Display only the UUID of a device:

`sudo blkid -s UUID {{/dev/sda1}}`

- Display only the filesystem type:

`sudo blkid -s TYPE {{/dev/sda1}}`

- Display all attributes in a key=value format:

`sudo blkid -o value {{/dev/sda1}}`

- Find a device by UUID:

`sudo blkid -U {{uuid}}`

- Find a device by label:

`sudo blkid -L {{label}}`

- Display information without device names:

`sudo blkid -o list`

- Probe all devices (including those without filesystems):

`sudo blkid -p {{/dev/sda}}`