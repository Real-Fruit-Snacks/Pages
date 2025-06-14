# route

> Display and manipulate IP routing table.
> More information: <https://man7.org/linux/man-pages/man8/route.8.html>.

- Display routing table:

`route`

- Display routing table with numeric addresses:

`route -n`

- Add a route:

`sudo route add -net {{192.168.1.0}} netmask {{255.255.255.0}} gw {{192.168.1.1}}`

- Add default gateway:

`sudo route add default gw {{192.168.1.1}}`

- Delete a route:

`sudo route del -net {{192.168.1.0}} netmask {{255.255.255.0}}`

- Delete default gateway:

`sudo route del default`

- Add route to specific interface:

`sudo route add -net {{192.168.2.0}} netmask {{255.255.255.0}} dev {{eth0}}`

- Add route with metric:

`sudo route add -net {{192.168.3.0}} netmask {{255.255.255.0}} gw {{192.168.1.1}} metric {{2}}`