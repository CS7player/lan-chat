// src/network/peers.js

const peers = new Map();

export function addPeer(ip, data) {
  peers.set(ip, data);
}

export function removePeer(ip) {
  peers.delete(ip);
}

export function hasPeer(ip) {
  return peers.has(ip);
}

export function getPeer(ip) {
  return peers.get(ip);
}

export function getPeers() {
  return peers;
}

export function getUsers() {
  return [...peers.values()];
}