# ln

> Create links to files and directories.
> More information: <https://www.gnu.org/software/coreutils/ln>.

- Create a symbolic link to a file or directory:

`ln -s {{/path/to/target}} {{link_name}}`

- Create a hard link to a file:

`ln {{/path/to/file}} {{link_name}}`

- Create a symbolic link to a file, creating parent directories if needed:

`ln -s {{/path/to/target}} {{/path/to/parent/link_name}}`

- Overwrite an existing link:

`ln -sf {{/path/to/new_target}} {{link_name}}`

- Create a symbolic link to a directory:

`ln -s {{/path/to/directory}} {{link_name}}`

- Create multiple links at once:

`ln -s {{target1 target2 ...}} {{/path/to/directory/}}`

- Create a symbolic link with a relative path:

`ln -sr {{target}} {{link_name}}`

- Create links verbosely:

`ln -sv {{/path/to/target}} {{link_name}}`