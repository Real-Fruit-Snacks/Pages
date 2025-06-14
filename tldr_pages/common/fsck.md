# fsck

> Check and repair filesystem consistency.
> More information: <https://man7.org/linux/man-pages/man8/fsck.8.html>.

- Check a filesystem (unmount first):

`sudo fsck {{/dev/sda1}}`

- Check all filesystems listed in /etc/fstab:

`sudo fsck -A`

- Check a filesystem without repairing:

`sudo fsck -n {{/dev/sda1}}`

- Automatically repair errors without prompting:

`sudo fsck -y {{/dev/sda1}}`

- Force check even if filesystem seems clean:

`sudo fsck -f {{/dev/sda1}}`

- Check with progress bar:

`sudo fsck -C {{/dev/sda1}}`

- Check only specific filesystem types:

`sudo fsck -t {{ext4,ext3}} -A`

- Skip checking mounted filesystems:

`sudo fsck -M -A`

- Verbose output:

`sudo fsck -v {{/dev/sda1}}`