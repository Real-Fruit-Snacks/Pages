# date

> Display or set the system date and time.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/date-invocation.html>.

- Display the current date and time:

`date`

- Display the current date in a specific format:

`date '+%Y-%m-%d'`

- Display the current date and time in UTC:

`date -u`

- Display a specific date (in the format MMDDhhmm[[CC]YY]):

`date {{021423302021}}`

- Convert a date to Unix timestamp:

`date -d '{{2021-02-14 23:30:00}}' +%s`

- Convert Unix timestamp to date:

`date -d @{{1613344200}}`

- Display yesterday's date:

`date -d 'yesterday'`

- Display date from a specific number of days ago:

`date -d '{{5}} days ago'`

- Display the current time in a different timezone:

`TZ='{{America/New_York}}' date`

- Set the system date (requires root):

`sudo date -s '{{2021-02-14 23:30:00}}'`