import React, { useState, useEffect } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [name, setName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Assume userId is stored in localStorage or context
  const userId = localStorage.getItem("userId");
  const apiBase = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        setCurrentName(res.data.name || "");
      } catch (err) {
        setCurrentName("");
      }
    };
    if (userId) fetchUser();
  }, [userId, apiBase]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {};
      if (name) payload.name = name;
      await axios.put(`${apiBase}/api/users/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      setMessage("Profile updated successfully!");
      setCurrentName(name || currentName);
      setName("");
    } catch (err) {
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDeregisterDrive = async () => {
    if (
      !window.confirm("Are you sure you want to disconnect your Google Drive?")
    )
      return;
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${apiBase}/api/auth/google/deregister`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setMessage("Google Drive disconnected.");
    } catch (err) {
      setMessage("Failed to disconnect Google Drive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="subject-card"
      style={{ maxWidth: 600, margin: "2rem auto" }}
    >
      <div className="subject-header" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Settings</h1>
      </div>
      <div style={{ marginBottom: 24, fontWeight: 600, color: "#374151" }}>
        Current Name: <span style={{ color: "#3b82f6" }}>{currentName}</span>
      </div>
      <button
        className="btn-danger"
        style={{ marginBottom: 32 }}
        onClick={handleDeregisterDrive}
        disabled={loading}
      >
        Deregister from Google Drive
      </button>
      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <label style={{ fontWeight: 600 }}>Update Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new name"
          style={{ padding: 10, borderRadius: 6, border: "1px solid #d1d5db" }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: 16 }}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: 24,
            color: message.includes("success") ? "green" : "#ef4444",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
