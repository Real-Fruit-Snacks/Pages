# scp

> Secure copy files between hosts over SSH.
> More information: <https://man.openbsd.org/scp>.

- Copy a local file to a remote host:

`scp {{path/to/local_file}} {{remote_user}}@{{remote_host}}:{{path/to/remote_file}}`

- Copy a file from a remote host to a local directory:

`scp {{remote_user}}@{{remote_host}}:{{path/to/remote_file}} {{path/to/local_directory}}`

- Recursively copy a directory from a remote host to a local directory:

`scp -r {{remote_user}}@{{remote_host}}:{{path/to/remote_directory}} {{path/to/local_directory}}`

- Copy a file between two remote hosts:

`scp {{user1}}@{{host1}}:{{path/to/file}} {{user2}}@{{host2}}:{{path/to/destination}}`

- Use a specific SSH private key for authentication:

`scp -i {{path/to/private_key}} {{local_file}} {{remote_user}}@{{remote_host}}:{{path/to/remote_file}}`

- Use a specific port:

`scp -P {{port}} {{local_file}} {{remote_user}}@{{remote_host}}:{{path/to/remote_file}}`

- Copy files matching a pattern:

`scp {{path/to/local_files}}*.txt {{remote_user}}@{{remote_host}}:{{path/to/remote_directory}}`

- Enable compression during transfer:

`scp -C {{large_file}} {{remote_user}}@{{remote_host}}:{{path/to/remote_file}}`