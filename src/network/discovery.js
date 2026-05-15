import dgram from "dgram";
import os from "os";

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
    port: 8080,
   });
   socket.send(
    message,
    0,
    message.length,
    PORT,
    "255.255.255.255"
   );
  }, 3000);
 });
 socket.on("message", (msg, rinfo) => {
  try {
   const data = JSON.parse(msg.toString());
   if (data.type === "DISCOVER") {
    onUserFound({
     ip: rinfo.address,
     username: data.username,
     hostname: data.hostname,
     port: data.port,
    });
   }
  } catch (err) { }
 });
}