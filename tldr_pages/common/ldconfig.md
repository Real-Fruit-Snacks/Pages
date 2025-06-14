# ldconfig

> Configure dynamic linker run-time bindings.
> More information: <https://man7.org/linux/man-pages/man8/ldconfig.8.html>.

- Update library cache:

`sudo ldconfig`

- Update cache with verbose output:

`sudo ldconfig -v`

- Print current cache:

`ldconfig -p`

- Add a directory to library path:

`sudo ldconfig {{/usr/local/lib}}`

- Ignore auxiliary cache file:

`sudo ldconfig -i`

- Process only specific directories:

`sudo ldconfig -n {{/lib}} {{/usr/lib}}`

- Use specific cache file:

`sudo ldconfig -C {{/tmp/ld.so.cache}}`

- Use specific config file:

`sudo ldconfig -f {{/etc/ld.so.conf}}`