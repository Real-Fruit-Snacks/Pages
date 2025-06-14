# hdparm

> Get and set SATA/IDE device parameters.
> More information: <https://man7.org/linux/man-pages/man8/hdparm.8.html>.

- Display drive identification:

`sudo hdparm -I {{/dev/sdX}}`

- Display basic info:

`sudo hdparm -i {{/dev/sdX}}`

- Test read speed:

`sudo hdparm -t {{/dev/sdX}}`

- Test cache read speed:

`sudo hdparm -T {{/dev/sdX}}`

- Enable write caching:

`sudo hdparm -W1 {{/dev/sdX}}`

- Set Advanced Power Management level:

`sudo hdparm -B {{128}} {{/dev/sdX}}`

- Put drive to sleep:

`sudo hdparm -y {{/dev/sdX}}`

- Set standby timeout (5 seconds units):

`sudo hdparm -S {{120}} {{/dev/sdX}}`