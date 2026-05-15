import dgram from "dgram";
import os from "node:os";
import { randomUUID } from "crypto";

const PORT = 41234;

/* =========================
   CREATE UDP SOCKET (FIXED)
========================= */
const socket = dgram.createSocket({
 type: "udp4",
 reuseAddr: true,
});

/* =========================
   DEVICE ID (IMPORTANT FIX)
========================= */
const DEVICE_ID = randomUUID();

/* =========================
   START DISCOVERY SYSTEM
========================= */
export function startDiscovery(username, onUserFound) {
 socket.bind(PORT, "0.0.0.0", () => {
  socket.setBroadcast(true);
  console.log("📡 UDP Discovery running on", PORT);
 });

 /* =========================
    RECEIVE DISCOVERIES
 ========================= */
 socket.on("message", (msg, rinfo) => {
  try {
   const data = JSON.parse(msg.toString());

   if (data.type !== "DISCOVER") return;

   // ❌ IGNORE SELF (VERY IMPORTANT)
   if (data.id === DEVICE_ID) return;

   const ip =
    (data.ip && data.ip.replace("::ffff:", "")) ||
    rinfo.address.replace("::ffff:", "");

   console.log("📥 DISCOVERY FROM:", ip);

   onUserFound({
    id: data.id,
    ip,
    username: data.username,
    hostname: data.hostname,
    port: data.port,
   });

  } catch (err) {
   console.log("UDP parse error:", err);
  }
 });

 /* =========================
    BROADCAST LOOP
 ========================= */
 setInterval(() => {
  const payload = {
   type: "DISCOVER",
   id: DEVICE_ID,
   username,
   hostname: os.hostname(),
   ip: getRealLANIP(),
   port: 8080,
  };

  const message = Buffer.from(JSON.stringify(payload));

  // GLOBAL BROADCAST
  socket.send(message, PORT, "255.255.255.255");

  // SUBNET BROADCAST (IMPORTANT FOR SOME ROUTERS)
  const subnet = getSubnetBroadcast();
  socket.send(message, PORT, subnet);

 }, 3000);
}

/* =========================
   GET REAL LAN IP (FIXED)
========================= */
export function getRealLANIP() {
 const nets = os.networkInterfaces();

 for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
   if (net.family !== "IPv4" || net.internal) continue;

   const ip = net.address;

   // ❌ SKIP VIRTUAL NETWORKS
   if (ip.startsWith("192.168.56.")) continue;
   if (ip.startsWith("169.254.")) continue;

   // ✅ PRIORITY LAN RANGE
   if (
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
   ) {
    return ip;
   }
  }
 }

 return "0.0.0.0";
}

/* =========================
   GET SUBNET BROADCAST
========================= */
function getSubnetBroadcast() {
 const ip = getRealLANIP();

 if (ip.startsWith("192.168.1.")) return "192.168.1.255";
 if (ip.startsWith("192.168.0.")) return "192.168.0.255";
 if (ip.startsWith("10.")) return "10.255.255.255";

 return "255.255.255.255";
}