# service

> Manage services on a System V init system.
> More information: <https://man7.org/linux/man-pages/man8/service.8.html>.

- List all services and their status:

`service --status-all`

- Start a service:

`sudo service {{service_name}} start`

- Stop a service:

`sudo service {{service_name}} stop`

- Restart a service:

`sudo service {{service_name}} restart`

- Check the status of a service:

`service {{service_name}} status`

- Reload service configuration:

`sudo service {{service_name}} reload`

- Enable a service to start at boot:

`sudo service {{service_name}} enable`

- Disable a service from starting at boot:

`sudo service {{service_name}} disable`

- Run a service action and show verbose output:

`sudo service {{service_name}} {{action}} --verbose`