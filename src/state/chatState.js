export const chatState = {
  users: [],
  messages: {},        // per-user messages
  selectedUser: null,
};

export function setSelectedUser(user) {
  chatState.selectedUser = user;

  if (!chatState.messages[user.username]) {
    chatState.messages[user.username] = [];
  }
}

export function addMessage(user, msg) {
  const key = user.username || "global";

  if (!chatState.messages[key]) {
    chatState.messages[key] = [];
  }

  chatState.messages[key].push(msg);
}