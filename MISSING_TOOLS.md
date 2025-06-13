# Missing Man Pages for Common Tools

## High Priority Network Tools
These tools are commonly used but require package installation to get their man pages:

### Network Analysis
- **tcpdump** - Network packet analyzer (install: `sudo apt install tcpdump`)
- **nmap** - Network exploration tool and security scanner (install: `sudo apt install nmap`)
- **wireshark/tshark** - Network protocol analyzer (install: `sudo apt install wireshark`)
- **tcpflow** - TCP flow recorder (install: `sudo apt install tcpflow`)
- **mtr** - Network diagnostic tool combining ping and traceroute (install: `sudo apt install mtr`)

### System Debugging
- **strace** - System call tracer (install: `sudo apt install strace`)
- **ltrace** - Library call tracer (install: `sudo apt install ltrace`)
- **gdb** - GNU debugger (install: `sudo apt install gdb`)
- **valgrind** - Memory debugging tool (install: `sudo apt install valgrind`)
- **perf** - Linux performance analysis tool (install: `sudo apt install linux-tools-common`)

### System Monitoring
- **iotop** - I/O monitoring (install: `sudo apt install iotop`)
- **atop** - Advanced system monitor (install: `sudo apt install atop`)
- **dstat** - Versatile resource statistics (install: `sudo apt install dstat`)
- **sysstat** - System performance tools (install: `sudo apt install sysstat`)

### Development Tools
- **gcc** - GNU C compiler (man page might be in gcc-doc package)
- **g++** - GNU C++ compiler (man page might be in gcc-doc package)
- **cargo** - Rust package manager (install: `sudo apt install cargo`)
- **npm** - Node.js package manager (install: `sudo apt install npm`)

## Already Added (45 new man pages)
We successfully added man pages for these tools that were already installed:
- Network: ssh, curl, wget, rsync, netstat, ss, ip
- System: systemctl, journalctl, sudo, mount, chmod, chown, ps, top, df, du
- Development: git, make, cmake, python, python3, perl, bash
- Package Management: apt, apt-get, dpkg
- Editors: vim
- Other: htop, docker, openssl, tar, gzip, sed, awk

## To Get All Missing Man Pages
To get man pages for the missing tools, you would need to either:
1. Install the packages (requires sudo access)
2. Download man pages from the package files manually
3. Use online man page sources

The application now has 10,335 man pages (increased from 10,290) with the addition of 45 commonly used tools.