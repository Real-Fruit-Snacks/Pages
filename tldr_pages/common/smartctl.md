# smartctl

> Monitor disk health using SMART.
> More information: <https://www.smartmontools.org/>.

- Display SMART health summary:

`sudo smartctl -H {{/dev/sdX}}`

- Display all SMART information:

`sudo smartctl -a {{/dev/sdX}}`

- Display device information:

`sudo smartctl -i {{/dev/sdX}}`

- Start a short self-test:

`sudo smartctl -t short {{/dev/sdX}}`

- Start a long self-test:

`sudo smartctl -t long {{/dev/sdX}}`

- Display test results:

`sudo smartctl -l selftest {{/dev/sdX}}`

- Display error log:

`sudo smartctl -l error {{/dev/sdX}}`

- Enable SMART on device:

`sudo smartctl -s on {{/dev/sdX}}`