# automake

> Generate Makefile.in files from Makefile.am files.
> More information: <https://www.gnu.org/software/automake/>.

- Generate Makefile.in files:

`automake`

- Add missing standard files:

`automake --add-missing`

- Copy missing standard files:

`automake --add-missing --copy`

- Force regeneration of files:

`automake --force-missing`

- Generate all Makefile.in files:

`automake --include-deps`

- Set strictness level to foreign:

`automake --foreign`

- Set strictness level to GNU:

`automake --gnu`

- Display warnings:

`automake --warnings={{all}}`