# ufw

> Uncomplicated Firewall.
> More information: <https://wiki.ubuntu.com/UncomplicatedFirewall>.

- Enable firewall:

`sudo ufw enable`

- Disable firewall:

`sudo ufw disable`

- Show status and rules:

`sudo ufw status verbose`

- Allow incoming traffic on port:

`sudo ufw allow {{22}}`

- Allow incoming traffic on port for specific protocol:

`sudo ufw allow {{80}}/{{tcp}}`

- Deny incoming traffic from IP:

`sudo ufw deny from {{192.168.1.100}}`

- Allow incoming traffic from subnet:

`sudo ufw allow from {{192.168.1.0/24}}`

- Delete a rule:

`sudo ufw delete allow {{22}}`

- Reset to defaults:

`sudo ufw --force reset`