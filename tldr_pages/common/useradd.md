# useradd

> Create a new user account.
> More information: <https://man7.org/linux/man-pages/man8/useradd.8.html>.

- Create a new user:

`sudo useradd {{username}}`

- Create a new user with a home directory:

`sudo useradd --create-home {{username}}`

- Create a new user with a specific shell:

`sudo useradd --shell {{/bin/bash}} {{username}}`

- Create a new user with a specific user ID:

`sudo useradd --uid {{1000}} {{username}}`

- Create a new user with a specific group:

`sudo useradd --gid {{group}} {{username}}`

- Create a new user with additional groups:

`sudo useradd --groups {{group1,group2}} {{username}}`

- Create a new user with a comment:

`sudo useradd --comment "{{Full Name}}" {{username}}`

- Create a system user (no home directory):

`sudo useradd --system {{username}}`