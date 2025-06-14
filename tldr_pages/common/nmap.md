# nmap

> Network exploration tool and security/port scanner.
> More information: <https://nmap.org/book/man.html>.

- Scan a single host:

`nmap {{192.168.1.1}}`

- Scan a range of IP addresses:

`nmap {{192.168.1.1-254}}`

- Scan a subnet:

`nmap {{192.168.1.0/24}}`

- Scan specific ports:

`nmap -p {{80,443,8080}} {{192.168.1.1}}`

- Scan all ports:

`nmap -p- {{192.168.1.1}}`

- Detect OS and services:

`sudo nmap -O -sV {{192.168.1.1}}`

- Fast scan (most common ports):

`nmap -F {{192.168.1.1}}`

- Stealth SYN scan:

`sudo nmap -sS {{192.168.1.1}}`

- Scan with scripts:

`nmap --script {{default|vuln}} {{192.168.1.1}}`

- Save results to file:

`nmap -oN {{output.txt}} {{192.168.1.1}}`