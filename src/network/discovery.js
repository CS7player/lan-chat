import dgram from "dgram";
import * as os from "os";

const PORT = 41234;
const socket = dgram.createSocket("udp4");

function ipToInt(ip) {
 return ip.split(".").reduce((acc, p) => (acc << 8) + Number(p), 0) >>> 0;
}

function intToIp(int) {
 return [
  (int >>> 24) & 255,
  (int >>> 16) & 255,
  (int >>> 8) & 255,
  int & 255,
 ].join(".");
}

function getBroadcastIp(netObj) {
 if (!netObj?.address || !netObj?.netmask) return null;
 const ipInt = ipToInt(netObj.address);
 const maskInt = ipToInt(netObj.netmask);
 const network = ipInt & maskInt;
 const broadcast = network | (~maskInt >>> 0);
 return intToIp(broadcast);
}

export function getRealLANIP() {
 const nets = os.networkInterfaces();
 let fallback = null;
 for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
   if (net.family !== "IPv4" || net.internal) continue;
   const ip = net.address;
   // skip virtual adapters
   if (ip.startsWith("192.168.56.")) continue;
   if (ip.startsWith("169.254.")) continue;
   const isPreferred =
    ip.startsWith("192.168.") ||
    ip.startsWith("10.");
   if (isPreferred) return net;
   fallback = net;
  }
 }
 return fallback || null;
}

export function startDiscovery(username, onUserFound) {
 socket.bind(PORT, () => {
  socket.setBroadcast(true);
  const interval = setInterval(() => {
   const net = getRealLANIP();
   if (!net) {
    console.log("No LAN interface found");
    return;
   }
   const broadcastIP = getBroadcastIp(net);
   if (!broadcastIP) {
    console.log("Could not compute broadcast IP");
    return;
   }
   const message = JSON.stringify({
    type: "DISCOVER",
    username,
    ip: net.address,
    port: 8080,
   });
   socket.send(
    message,
    0,
    message.length,
    PORT,
    broadcastIP
   );
  }, 3000);
  socket.interval = interval;
 });
 socket.on("message", (msg, rinfo) => {
  try {
   const data = JSON.parse(msg.toString());
   if (data.type === "DISCOVER") {
    onUserFound({
     ip: data.ip || rinfo.address,
     username: data.username,
     port: data.port,
    });
   }
  } catch (err) {
   // ignore invalid packets
   console.log(123, err);
  }
 });
}