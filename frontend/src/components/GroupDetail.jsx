import React from "react";
import { useParams } from "react-router-dom";

const GroupDetail = () => {
  const { groupId } = useParams();
  return (
    <div style={{ padding: 24 }}>
      <h2>Group Details</h2>
      <p>Group ID: {groupId}</p>
      {/* Add group info, members, files, etc. here */}
    </div>
  );
};

export default GroupDetail;
