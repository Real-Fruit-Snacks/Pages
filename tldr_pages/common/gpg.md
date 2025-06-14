# gpg

> GNU Privacy Guard encryption and signing tool.
> More information: <https://gnupg.org/>.

- Generate a new key pair:

`gpg --full-generate-key`

- List all keys:

`gpg --list-keys`

- List secret keys:

`gpg --list-secret-keys`

- Encrypt a file:

`gpg --encrypt --recipient {{email@example.com}} {{file.txt}}`

- Decrypt a file:

`gpg --decrypt {{file.txt.gpg}}`

- Sign a file:

`gpg --sign {{file.txt}}`

- Verify a signature:

`gpg --verify {{file.txt.sig}}`

- Export a public key:

`gpg --export --armor {{email@example.com}} > {{public.key}}`

- Import a key:

`gpg --import {{key.asc}}`