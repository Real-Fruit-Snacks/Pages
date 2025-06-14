# userdel

> Delete a user account.
> More information: <https://man7.org/linux/man-pages/man8/userdel.8.html>.

- Delete a user:

`sudo userdel {{username}}`

- Delete a user and their home directory:

`sudo userdel --remove {{username}}`

- Delete a user and their home directory even if not owned by the user:

`sudo userdel --remove --force {{username}}`

- Delete a user but keep their home directory:

`sudo userdel {{username}}`

- Delete a user and remove them from all groups:

`sudo userdel {{username}}`

- Delete a user while another process is using their resources:

`sudo userdel --force {{username}}`