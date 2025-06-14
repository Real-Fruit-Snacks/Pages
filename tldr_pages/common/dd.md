# dd

> Convert and copy files.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/dd-invocation.html>.

- Make a bootable USB drive from an ISO file:

`dd if={{path/to/image.iso}} of={{/dev/usb_device}} status=progress`

- Clone a hard drive to another drive:

`dd if={{/dev/source_device}} of={{/dev/destination_device}} status=progress`

- Create a file of specific size filled with zeros:

`dd if=/dev/zero of={{path/to/file}} bs={{1M}} count={{100}}`

- Backup the MBR (Master Boot Record):

`dd if={{/dev/sda}} of={{path/to/mbr_backup}} bs=512 count=1`

- Restore the MBR:

`dd if={{path/to/mbr_backup}} of={{/dev/sda}} bs=512 count=1`

- Convert a file to uppercase:

`dd if={{input_file}} of={{output_file}} conv=ucase`

- Write random data to a drive (secure erase):

`dd if=/dev/urandom of={{/dev/sda}} status=progress`

- Skip and seek specific blocks:

`dd if={{input_file}} of={{output_file}} skip={{10}} seek={{20}} bs={{512}}`