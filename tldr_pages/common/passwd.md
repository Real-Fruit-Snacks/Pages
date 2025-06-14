# passwd

> Change a user's password.
> More information: <https://man7.org/linux/man-pages/man1/passwd.1.html>.

- Change your own password:

`passwd`

- Change another user's password (requires root):

`sudo passwd {{username}}`

- Change password non-interactively:

`echo "{{username}}:{{new_password}}" | sudo chpasswd`

- Lock a user account:

`sudo passwd -l {{username}}`

- Unlock a user account:

`sudo passwd -u {{username}}`

- Delete a user's password (passwordless login):

`sudo passwd -d {{username}}`

- Expire a user's password immediately:

`sudo passwd -e {{username}}`

- Check password status:

`sudo passwd -S {{username}}`