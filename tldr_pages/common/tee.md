# tee

> Read from standard input and write to standard output and files.
> More information: <https://www.gnu.org/software/coreutils/manual/html_node/tee-invocation.html>.

- Copy input to a file and also to stdout:

`echo "{{text}}" | tee {{path/to/file}}`

- Append to a file instead of overwriting:

`echo "{{text}}" | tee -a {{path/to/file}}`

- Write to multiple files:

`echo "{{text}}" | tee {{file1}} {{file2}} {{file3}}`

- Ignore interrupt signals:

`echo "{{text}}" | tee -i {{path/to/file}}`

- Use with sudo to write to protected files:

`echo "{{text}}" | sudo tee {{/etc/config_file}}`

- Capture command output while displaying it:

`{{command}} | tee {{output.log}}`

- Save and view compilation errors:

`make 2>&1 | tee {{build.log}}`

- Monitor a log file while saving output:

`tail -f {{/var/log/syslog}} | tee {{monitor.log}}`