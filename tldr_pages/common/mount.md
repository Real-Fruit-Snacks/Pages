# mount

> Mount filesystems.
> More information: <https://man7.org/linux/man-pages/man8/mount.8.html>.

- Show all mounted filesystems:

`mount`

- Mount a device to a directory:

`mount {{[-t|--types]}} {{filesystem_type}} {{path/to/device}} {{path/to/mount_point}}`

- Mount a CD-ROM device:

`mount {{[-t|--types]}} {{iso9660}} {{[-o|--options]}} {{ro}} {{/dev/cdrom}} {{/mnt/cdrom}}`

- Mount a USB drive:

`mount {{/dev/sdb1}} {{/mnt/usb}}`

- Mount a filesystem image:

`mount {{[-o|--options]}} {{loop}} {{path/to/image.iso}} {{/mnt/iso}}`

- Mount an NFS share:

`mount {{[-t|--types]}} {{nfs}} {{server:/path/to/share}} {{/mnt/nfs}}`

- Mount with specific options:

`mount {{[-o|--options]}} {{rw,noexec,nosuid}} {{/dev/sdb1}} {{/mnt/usb}}`

- Mount a filesystem read-only:

`mount {{[-o|--options]}} {{ro}} {{/dev/sdb1}} {{/mnt/usb}}`

- Remount a filesystem with different options:

`mount {{[-o|--options]}} {{remount,rw}} {{/mnt/usb}}`