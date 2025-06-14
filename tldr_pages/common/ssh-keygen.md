# ssh-keygen

> Generate SSH keys for authentication.
> More information: <https://man.openbsd.org/ssh-keygen>.

- Generate an RSA key pair:

`ssh-keygen -t rsa -b {{4096}}`

- Generate an Ed25519 key pair:

`ssh-keygen -t ed25519`

- Generate a key with specific filename:

`ssh-keygen -f {{~/.ssh/id_custom}}`

- Generate a key with a comment:

`ssh-keygen -C "{{email@example.com}}"`

- Change passphrase of existing key:

`ssh-keygen -p -f {{~/.ssh/id_rsa}}`

- Generate public key from private key:

`ssh-keygen -y -f {{~/.ssh/id_rsa}} > {{~/.ssh/id_rsa.pub}}`

- Test if key is known in known_hosts:

`ssh-keygen -F {{hostname}}`

- Remove host from known_hosts:

`ssh-keygen -R {{hostname}}`