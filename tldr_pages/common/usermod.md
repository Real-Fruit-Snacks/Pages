# usermod

> Modify a user account.
> More information: <https://man7.org/linux/man-pages/man8/usermod.8.html>.

- Change a user's name:

`sudo usermod --login {{new_username}} {{username}}`

- Change a user's home directory:

`sudo usermod --home {{/path/to/new_home}} --move-home {{username}}`

- Change a user's shell:

`sudo usermod --shell {{/bin/zsh}} {{username}}`

- Add a user to supplementary groups:

`sudo usermod --append --groups {{group1,group2}} {{username}}`

- Change a user's primary group:

`sudo usermod --gid {{group}} {{username}}`

- Change a user's comment/description:

`sudo usermod --comment "{{New Name}}" {{username}}`

- Lock a user account:

`sudo usermod --lock {{username}}`

- Unlock a user account:

`sudo usermod --unlock {{username}}`