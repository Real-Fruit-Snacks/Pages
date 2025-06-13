# umount

> Unmount filesystems.
> More information: <https://man7.org/linux/man-pages/man8/umount.8.html>.

- Unmount a filesystem by providing the path to the source:

`sudo umount {{/dev/sdb1}}`

- Unmount a filesystem by providing the path to the mount point:

`sudo umount {{/mnt/usb}}`

- Unmount all mounted filesystems (except `/proc` and other special filesystems):

`sudo umount -a`

- Force unmount (use with caution):

`sudo umount -f {{/mnt/mount_point}}`

- Lazy unmount (unmount now, cleanup later when not busy):

`sudo umount -l {{/mnt/mount_point}}`

- Unmount a filesystem and remove its entry from `/etc/mtab`:

`sudo umount -n {{/mnt/mount_point}}`

- Unmount only filesystems with a specific type:

`sudo umount -a -t {{nfs,cifs}}`