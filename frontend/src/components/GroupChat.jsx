import React from "react";

const mockMessages = [
  { _id: 1, sender: "Alice", text: "Hello!", time: "10:00" },
  { _id: 2, sender: "Bob", text: "Hi Alice!", time: "10:01" },
  { _id: 3, sender: "Alice", text: "How are you?", time: "10:02" },
];

const GroupChat = ({ group }) => {
  // TODO: Fetch messages for group._id
  return (
    <div
      style={{
        padding: 24,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 22, marginBottom: 16 }}>
        {group.name}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#f4f7fa",
          borderRadius: 8,
          padding: 16,
        }}
      >
        {mockMessages.map((msg) => (
          <div key={msg._id} style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: "bold", marginRight: 8 }}>
              {msg.sender}:
            </span>
            <span>{msg.text}</span>
            <span style={{ float: "right", color: "#aaa", fontSize: 12 }}>
              {msg.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupChat;
