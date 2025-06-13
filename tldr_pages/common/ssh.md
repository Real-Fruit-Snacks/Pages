# ssh

> Secure Shell client for logging into remote machines.
> More information: <https://man.openbsd.org/ssh>.

- Connect to a remote server:

`ssh {{username}}@{{remote_host}}`

- Connect to a remote server on a specific port:

`ssh -p {{port}} {{username}}@{{remote_host}}`

- Connect using a specific private key:

`ssh -i {{/path/to/key}} {{username}}@{{remote_host}}`

- Run a command on a remote server:

`ssh {{username}}@{{remote_host}} {{command}}`

- SSH tunneling: Forward a local port to a remote host:

`ssh -L {{local_port}}:{{remote_host}}:{{remote_port}} {{username}}@{{ssh_server}}`

- SSH tunneling: Forward a remote port to local host:

`ssh -R {{remote_port}}:{{localhost}}:{{local_port}} {{username}}@{{remote_host}}`

- Enable X11 forwarding:

`ssh -X {{username}}@{{remote_host}}`

- Enable compression:

`ssh -C {{username}}@{{remote_host}}`