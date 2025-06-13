# mount

> Mount filesystems.
> More information: <https://man7.org/linux/man-pages/man8/mount.8.html>.

- Mount a device to a directory:

`sudo mount {{/dev/sdb1}} {{/mnt/usb}}`

- Mount a CD-ROM device (with the filetype ISO9660) to `/cdrom` (readonly):

`sudo mount -t {{iso9660}} -o ro {{/dev/cdrom}} {{/cdrom}}`

- Mount all filesystems defined in `/etc/fstab`:

`sudo mount -a`

- Mount a specific filesystem described in `/etc/fstab`:

`sudo mount {{/mnt/backup}}`

- Mount a directory to another directory (bind mount):

`sudo mount --bind {{/source/directory}} {{/target/directory}}`

- Mount an ISO file:

`sudo mount -o loop {{image.iso}} {{/mnt/iso}}`

- Mount with a specific filesystem type:

`sudo mount -t {{ext4}} {{/dev/sda1}} {{/mnt/disk}}`

- List all mounted filesystems:

`mount`