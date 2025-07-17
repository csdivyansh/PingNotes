import React, { useEffect, useState } from "react";

const mockGroups = [
  { _id: "1", name: "Group Alpha" },
  { _id: "2", name: "Group Beta" },
  { _id: "3", name: "Group Gamma" },
];

const GroupSidebar = ({ setSelectedGroup, selectedGroup }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // TODO: Replace with API call to fetch user groups
    setGroups(mockGroups);
  }, []);

  return (
    <aside
      style={{
        width: 280,
        background: "#fff",
        borderRight: "1px solid #eee",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: 16,
          fontWeight: "bold",
          fontSize: 20,
          borderBottom: "1px solid #eee",
        }}
      >
        Groups
      </div>
      {groups.map((group) => (
        <div
          key={group._id}
          onClick={() => setSelectedGroup(group)}
          style={{
            padding: "14px 20px",
            cursor: "pointer",
            background:
              selectedGroup && selectedGroup._id === group._id
                ? "#e7f3ff"
                : "transparent",
            borderBottom: "1px solid #f3f3f3",
            fontWeight:
              selectedGroup && selectedGroup._id === group._id
                ? "bold"
                : "normal",
          }}
        >
          {group.name}
        </div>
      ))}
    </aside>
  );
};

export default GroupSidebar;
