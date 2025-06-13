# rsync

> Fast, versatile file copying tool that can copy locally and to/from remote hosts.
> More information: <https://rsync.samba.org>.

- Copy files locally:

`rsync -a {{/source/path/}} {{/destination/path/}}`

- Copy files to a remote host:

`rsync -a {{/source/path/}} {{username}}@{{remote_host}}:{{/destination/path/}}`

- Copy files from a remote host:

`rsync -a {{username}}@{{remote_host}}:{{/source/path/}} {{/destination/path/}}`

- Copy files with progress and human-readable sizes:

`rsync -ah --progress {{/source/path/}} {{/destination/path/}}`

- Copy directory contents (not the directory itself):

`rsync -a {{/source/directory/}}/ {{/destination/directory/}}`

- Synchronize and delete files in destination not present in source:

`rsync -a --delete {{/source/path/}} {{/destination/path/}}`

- Copy files over SSH on a specific port:

`rsync -a -e "ssh -p {{port}}" {{/source/path/}} {{username}}@{{remote_host}}:{{/destination/path/}}`

- Show what would be transferred without actually copying:

`rsync -an {{/source/path/}} {{/destination/path/}}`