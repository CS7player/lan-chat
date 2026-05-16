import * as os from "os";
import { startWSServer, connectToPeer } from "./network/websocket.js";
import { startDiscovery, getRealLANIP } from "./network/discovery.js";

const username = os.userInfo().username;

startWSServer(username);

startDiscovery(username, (user) => {
 if (user.username === username) return;
 connectToPeer(user.ip, username);
});


