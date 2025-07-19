import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DashNav from "./DashNav.jsx";

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [addPersonGroupId, setAddPersonGroupId] = useState(null);
  const [personEmail, setPersonEmail] = useState("");
  const [addingPerson, setAddingPerson] = useState(false);
  const [addPersonError, setAddPersonError] = useState(null);
  const [addPersonSuccess, setAddPersonSuccess] = useState(null);
  const [deletingGroupId, setDeletingGroupId] = useState(null);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("adminToken");
      const url = "/api/groups/my-groups";
      const res = await api.request(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res);
    } catch (err) {
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("adminToken");
      const userId = JSON.parse(atob(token.split(".")[1])).id; // decode JWT to get user id
      const payload = {
        name: newGroupName,
        groupAdmin: userId,
        members: [userId],
      };
      const res = await api.request("/api/groups", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      setShowCreateModal(false);
      setNewGroupName("");
      fetchGroups();
    } catch (err) {
      setCreateError("Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const openAddPersonModal = (groupId) => {
    setAddPersonGroupId(groupId);
    setPersonEmail("");
    setAddPersonError(null);
    setAddPersonSuccess(null);
    setShowAddPersonModal(true);
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    setAddingPerson(true);
    setAddPersonError(null);
    setAddPersonSuccess(null);
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("adminToken");
      await api.post(
        "/groups/join-by-email",
        { groupId: addPersonGroupId, email: personEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddPersonSuccess("User added to group!");
      setPersonEmail("");
      fetchGroups();
    } catch (err) {
      setAddPersonError(
        "Failed to add user. Make sure the email is correct and you are the group admin."
      );
    } finally {
      setAddingPerson(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone."
      )
    )
      return;
    setDeletingGroupId(groupId);
    try {
      const token =
        localStorage.getItem("userToken") || localStorage.getItem("adminToken");
      await api.request(`/api/groups/${groupId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroups();
    } catch (err) {
      alert("Failed to delete group");
    } finally {
      setDeletingGroupId(null);
    }
  };

  return (
    <>
      <DashNav />
      <div
        className="my-groups-page"
        style={{ maxWidth: 700, margin: "2rem auto", padding: 24 }}
      >
        <h2 style={{ fontSize: 32, marginBottom: 24 }}>My Groups</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            marginBottom: 24,
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
          }}
        >
          ➕ Create Group
        </button>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        {loading ? (
          <div>Loading groups...</div>
        ) : !error && groups.length === 0 ? (
          <p>You are not a member of any groups yet.</p>
        ) : (
          !error && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {groups.map((group) => {
                const isAdmin =
                  group.groupAdmin ===
                  JSON.parse(
                    atob(
                      (
                        localStorage.getItem("userToken") ||
                        localStorage.getItem("adminToken")
                      ).split(".")[1]
                    )
                  ).id;
                return (
                  <div
                    key={group._id}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      boxShadow: "0 2px 12px rgba(59,130,246,0.07)",
                      padding: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1.5px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {group.name}
                      </div>
                      <div
                        style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}
                      >
                        Group ID:{" "}
                        <span style={{ color: "#3b82f6" }}>{group._id}</span>
                        {isAdmin && (
                          <span
                            style={{
                              color: "#10b981",
                              fontWeight: 600,
                              marginLeft: 12,
                            }}
                          >
                            (You are Admin)
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={() => setExpandedGroupId(group._id)}
                        style={{
                          background: "#6366f1",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 18px",
                          fontWeight: 500,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      {isAdmin && expandedGroupId === group._id && (
                        <>
                          <button
                            title="Add Person"
                            style={{
                              background: "#10b981",
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              fontWeight: 500,
                              fontSize: 18,
                              cursor: "pointer",
                            }}
                            onClick={() => openAddPersonModal(group._id)}
                          >
                            <span role="img" aria-label="Add Person">
                              👤
                            </span>
                          </button>
                          <button
                            title="Delete Group"
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: 8,
                              padding: "8px 12px",
                              fontWeight: 500,
                              fontSize: 18,
                              cursor: "pointer",
                            }}
                            onClick={() => handleDeleteGroup(group._id)}
                            disabled={deletingGroupId === group._id}
                          >
                            {deletingGroupId === group._id ? "⏳" : "🗑️"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
        {showCreateModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(59,130,246,0.18)",
                padding: "32px 32px 24px 32px",
                minWidth: 340,
                maxWidth: 400,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: 22, marginBottom: 18 }}>Create Group</h3>
              <form onSubmit={handleCreateGroup} style={{ width: "100%" }}>
                <input
                  type="text"
                  placeholder="Group Name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1.5px solid #e2e8f0",
                    fontSize: 16,
                    marginBottom: 18,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <button
                    type="submit"
                    disabled={creating}
                    style={{
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 20px",
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      background: "#e5e7eb",
                      color: "#374151",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 20px",
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {createError && (
                  <div style={{ color: "#ef4444", marginTop: 10 }}>
                    {createError}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
        {showAddPersonModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(59,130,246,0.18)",
                padding: "32px 32px 24px 32px",
                minWidth: 340,
                maxWidth: 400,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: 22, marginBottom: 18 }}>
                Add Person to Group
              </h3>
              <form onSubmit={handleAddPerson} style={{ width: "100%" }}>
                <input
                  type="email"
                  placeholder="User Email"
                  value={personEmail}
                  onChange={(e) => setPersonEmail(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1.5px solid #e2e8f0",
                    fontSize: 16,
                    marginBottom: 18,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <button
                    type="submit"
                    disabled={addingPerson}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 20px",
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    {addingPerson ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPersonModal(false)}
                    style={{
                      background: "#e5e7eb",
                      color: "#374151",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 20px",
                      fontWeight: 500,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {addPersonError && (
                  <div style={{ color: "#ef4444", marginTop: 10 }}>
                    {addPersonError}
                  </div>
                )}
                {addPersonSuccess && (
                  <div style={{ color: "#10b981", marginTop: 10 }}>
                    {addPersonSuccess}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyGroups;
