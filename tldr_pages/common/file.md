# file

> Determine file type.
> More information: <https://man7.org/linux/man-pages/man1/file.1.html>.

- Determine the type of a file:

`file {{filename}}`

- Determine the type of multiple files:

`file {{file1 file2 file3}}`

- Don't stop at the first match (continue searching):

`file -k {{filename}}`

- Look inside compressed files:

`file -z {{archive.tar.gz}}`

- Show MIME type instead of human-readable output:

`file -i {{filename}}`

- Determine the type of files in a directory:

`file {{directory/*}}`

- Follow symbolic links:

`file -L {{symlink}}`

- Brief mode (only show file type):

`file -b {{filename}}`