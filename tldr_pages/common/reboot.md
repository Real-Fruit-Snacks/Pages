# reboot

> Restart the system.
> More information: <https://man7.org/linux/man-pages/man8/reboot.8.html>.

- Reboot immediately:

`sudo reboot`

- Reboot immediately without gracefully shutting down:

`sudo reboot -f`

- Reboot at a specific time:

`sudo shutdown -r {{HH:MM}}`

- Reboot in 5 minutes:

`sudo shutdown -r +5`

- Reboot with a message:

`sudo shutdown -r +5 "{{System will reboot for maintenance}}"`

- Cancel a scheduled reboot:

`sudo shutdown -c`

- Reboot into firmware/BIOS settings:

`sudo systemctl reboot --firmware-setup`

- Perform a kexec "fast reboot" (skip BIOS):

`sudo kexec -l {{/boot/vmlinuz}} --initrd={{/boot/initrd}} --reuse-cmdline && sudo kexec -e`