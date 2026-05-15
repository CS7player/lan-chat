cli

netsh advfirewall firewall add rule name="LAN Chat UDP" dir=in action=allow protocol=UDP localport=41234 profile=private

netsh advfirewall firewall add rule name="Node.js UDP" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes profile=private

netsh advfirewall firewall show rule name="LAN Chat UDP"

