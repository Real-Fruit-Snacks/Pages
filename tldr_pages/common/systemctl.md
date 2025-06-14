# systemctl

> Control the systemd system and service manager.
> More information: <https://www.freedesktop.org/software/systemd/man/systemctl.html>.

- Show all running services:

`systemctl status`

- List all services (running and stopped):

`systemctl list-units --type=service`

- Start a service:

`systemctl start {{service}}`

- Stop a service:

`systemctl stop {{service}}`

- Restart a service:

`systemctl restart {{service}}`

- Show the status of a service:

`systemctl status {{service}}`

- Enable a service to start on boot:

`systemctl enable {{service}}`

- Disable a service from starting on boot:

`systemctl disable {{service}}`

- Reload configuration without restarting services:

`systemctl reload {{service}}`

- Check if a service is enabled:

`systemctl is-enabled {{service}}`

- Show system status:

`systemctl status`

- Reload systemd manager configuration:

`systemctl daemon-reload`