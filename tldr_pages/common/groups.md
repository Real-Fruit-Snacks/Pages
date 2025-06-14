# groups

> Display group memberships for users.
> More information: <https://man7.org/linux/man-pages/man1/groups.1.html>.

- Display groups for current user:

`groups`

- Display groups for a specific user:

`groups {{username}}`

- Display groups for multiple users:

`groups {{user1}} {{user2}} {{user3}}`

- Display only group names (no username):

`groups {{username}} | cut -d: -f2`

- Display primary group:

`id -gn {{username}}`

- Display all groups with IDs:

`id -G {{username}}`

- Display all groups with names:

`id -Gn {{username}}`