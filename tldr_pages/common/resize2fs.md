# resize2fs

> Resize ext2/ext3/ext4 filesystems.
> More information: <https://man7.org/linux/man-pages/man8/resize2fs.8.html>.

- Resize filesystem to fill the partition:

`sudo resize2fs {{/dev/sdXY}}`

- Resize filesystem to specific size:

`sudo resize2fs {{/dev/sdXY}} {{10G}}`

- Shrink filesystem to minimum size:

`sudo resize2fs -M {{/dev/sdXY}}`

- Check filesystem before resizing:

`sudo e2fsck -f {{/dev/sdXY}} && sudo resize2fs {{/dev/sdXY}}`

- Display progress while resizing:

`sudo resize2fs -p {{/dev/sdXY}}`

- Resize filesystem on a mounted partition (ext3/4 only):

`sudo resize2fs {{/dev/sdXY}}`

- Print estimated minimum size:

`sudo resize2fs -P {{/dev/sdXY}}`