# passwd

> Change a user's password.
> More information: <https://man7.org/linux/man-pages/man1/passwd.1.html>.

- Change the password of the current user:

`passwd`

- Change the password of a specific user:

`sudo passwd {{username}}`

- Force user to change password at next login:

`sudo passwd -e {{username}}`

- Lock a user account:

`sudo passwd -l {{username}}`

- Unlock a user account:

`sudo passwd -u {{username}}`

- Delete a user's password (make it empty):

`sudo passwd -d {{username}}`

- Display password status information:

`sudo passwd -S {{username}}`

- Set minimum days between password changes:

`sudo passwd -n {{days}} {{username}}`