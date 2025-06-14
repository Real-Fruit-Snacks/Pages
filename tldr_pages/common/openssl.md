# openssl

> OpenSSL cryptographic toolkit.
> More information: <https://www.openssl.org/>.

- Generate a private key:

`openssl genrsa -out {{private.key}} {{2048}}`

- Generate a certificate signing request:

`openssl req -new -key {{private.key}} -out {{request.csr}}`

- Generate a self-signed certificate:

`openssl req -x509 -newkey rsa:4096 -keyout {{key.pem}} -out {{cert.pem}} -days {{365}}`

- Check a certificate:

`openssl x509 -in {{cert.pem}} -text -noout`

- Encrypt a file:

`openssl enc -aes-256-cbc -in {{input.txt}} -out {{encrypted.txt}}`

- Decrypt a file:

`openssl enc -d -aes-256-cbc -in {{encrypted.txt}} -out {{decrypted.txt}}`

- Generate a SHA256 hash:

`openssl dgst -sha256 {{file.txt}}`

- Test SSL/TLS connection:

`openssl s_client -connect {{example.com}}:{{443}}`