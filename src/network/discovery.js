import dgram from "dgram";
import * as os from "node:os";

const PORT = 41234;
const socket = dgram.createSocket("udp4");

export function startDiscovery(username, onUserFound) {
 socket.bind(PORT, () => {
  socket.setBroadcast(true);
  // Broadcast every 3 sec
  setInterval(() => {
   const message = JSON.stringify({
    type: "DISCOVER",
    username,
    hostname: os.hostname(),
    ip: getRealLANIP(),
    port: 8080,
   });
   socket.send(
    message,
    0,
    message.length,
    PORT,
    "192.168.1.255"
   );
  }, 3000);
 });
 socket.on("message", (msg, rinfo) => {
  try {
   const data = JSON.parse(msg.toString());
   if (data.type === "DISCOVER") {
    onUserFound({
     ip: data.ip || rinfo.address,
     username: data.username,
     hostname: data.hostname,
     port: data.port,
    });
   }
  } catch (err) { }
 });
}

export function getRealLANIP() {
 const nets = os.networkInterfaces();

 let fallback = null;

 for (const name of Object.keys(nets)) {
  const list = nets[name];

  for (const net of list) {

   if (net.family !== "IPv4" || net.internal) continue;

   const ip = net.address;

   // ❌ HARD SKIP VirtualBox / VMware range
   if (ip.startsWith("192.168.56.")) continue;

   // ❌ SKIP weird adapters
   if (ip.startsWith("169.254.")) continue;

   // ✅ PRIORITY: real LAN WiFi range
   if (
    ip.startsWith("192.168.1.") ||
    ip.startsWith("192.168.0.") ||
    ip.startsWith("10.")
   ) {
    return ip;
   }

   // fallback candidate
   fallback = ip;
  }
 }

 return fallback || "0.0.0.0";
}