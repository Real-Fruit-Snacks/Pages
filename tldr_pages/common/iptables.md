# iptables

> Configure Linux kernel IPv4 firewall.
> More information: <https://man7.org/linux/man-pages/man8/iptables.8.html>.

- List all rules:

`sudo iptables -L`

- List all rules with numeric output:

`sudo iptables -L -n`

- List all rules with verbose output:

`sudo iptables -L -v`

- Allow incoming traffic on port:

`sudo iptables -A INPUT -p tcp --dport {{80}} -j ACCEPT`

- Block incoming traffic from IP:

`sudo iptables -A INPUT -s {{192.168.1.100}} -j DROP`

- Delete a rule:

`sudo iptables -D INPUT {{rule_number}}`

- Save rules:

`sudo iptables-save > {{/etc/iptables/rules.v4}}`

- Restore rules:

`sudo iptables-restore < {{/etc/iptables/rules.v4}}`