# cryptsetup

> Manage encrypted volumes using dm-crypt/LUKS.
> More information: <https://gitlab.com/cryptsetup/cryptsetup>.

- Format a partition with LUKS encryption:

`sudo cryptsetup luksFormat {{/dev/sdXY}}`

- Open an encrypted partition:

`sudo cryptsetup luksOpen {{/dev/sdXY}} {{mapping_name}}`

- Close an encrypted partition:

`sudo cryptsetup luksClose {{mapping_name}}`

- Change LUKS passphrase:

`sudo cryptsetup luksChangeKey {{/dev/sdXY}}`

- Add a new passphrase:

`sudo cryptsetup luksAddKey {{/dev/sdXY}}`

- Remove a passphrase:

`sudo cryptsetup luksRemoveKey {{/dev/sdXY}}`

- Display LUKS header information:

`sudo cryptsetup luksDump {{/dev/sdXY}}`

- Backup LUKS header:

`sudo cryptsetup luksHeaderBackup {{/dev/sdXY}} --header-backup-file {{backup.img}}`