# umount

> Unmount filesystems.
> More information: <https://man7.org/linux/man-pages/man8/umount.8.html>.

- Unmount a filesystem by specifying the mount point:

`umount {{path/to/mount_point}}`

- Unmount a filesystem by specifying the device:

`umount {{/dev/sdb1}}`

- Unmount all mounted filesystems (except /proc):

`umount -a`

- Force unmount a busy filesystem:

`umount {{[-f|--force]}} {{path/to/mount_point}}`

- Lazy unmount (detach now, clean up later):

`umount {{[-l|--lazy]}} {{path/to/mount_point}}`

- Unmount a specific filesystem type:

`umount {{[-t|--types]}} {{filesystem_type}}`

- Dry run (don't actually unmount):

`umount {{[-n|--no-mtab]}} {{path/to/mount_point}}`

- Unmount and remove the mount point directory:

`umount {{[-d|--detach-loop]}} {{path/to/mount_point}}`