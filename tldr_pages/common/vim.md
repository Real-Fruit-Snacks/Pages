# vim

> Vi IMproved, a text editor based on vi with many enhancements.
> More information: <https://www.vim.org/>.

- Open a file:

`vim {{path/to/file}}`

- Open a file at a specific line:

`vim +{{line_number}} {{path/to/file}}`

- Open multiple files:

`vim {{file1}} {{file2}} {{file3}}`

- Open a file in read-only mode:

`vim -R {{path/to/file}}`

- Open files in horizontal split windows:

`vim -o {{file1}} {{file2}}`

- Open files in vertical split windows:

`vim -O {{file1}} {{file2}}`

- Open files in tabs:

`vim -p {{file1}} {{file2}}`

- Exit vim (when in command mode):

`:q`

- Exit without saving (force quit):

`:q!`

- Save and exit:

`:wq` or `:x`

- Enter insert mode:

`i`

- Exit insert mode:

`Esc`