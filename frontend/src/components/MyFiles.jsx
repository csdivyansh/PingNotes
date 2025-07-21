import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import { FaDownload, FaTrash, FaShareAlt } from "react-icons/fa";
import DashNav from "./DashNav.jsx";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  // Placeholder: friends list and selected friends
  const [friends, setFriends] = useState([
    { _id: "1", name: "Alice" },
    { _id: "2", name: "Bob" },
    // ...fetch from backend in real impl
  ]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMyFiles();
      setFiles(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!fileId) {
      alert("Invalid file ID");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    setDeletingId(fileId);
    try {
      await apiService.request(`/api/files/${fileId}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      alert("Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  const openShareModal = (file) => {
    setFileToShare(file);
    setShowShareModal(true);
    setSelectedFriends([]);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setFileToShare(null);
    setSelectedFriends([]);
  };

  const handleFriendToggle = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleAddFriendByEmail = () => {
    if (!friendEmail.trim()) return;
    if (!friends.some((f) => f.email === friendEmail.trim())) {
      const newFriend = {
        _id: friendEmail.trim(),
        name: friendEmail.trim(),
        email: friendEmail.trim(),
      };
      setFriends((prev) => [...prev, newFriend]);
    }
    setSelectedFriends((prev) => [...prev, friendEmail.trim()]);
    setFriendEmail("");
  };

  const handleShare = async () => {
    try {
      await apiService.shareFile(fileToShare._id, selectedFriends);
      alert("File shared successfully!");
    } catch (err) {
      alert("Failed to share file");
    }
    closeShareModal();
  };

  return (
    <>
      <DashNav />
      <div
        className="subject-card"
        style={{ maxWidth: 900, margin: "2rem auto" }}
      >
        <div className="subject-header" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>My Files</h1>
        </div>
        {loading ? (
          <div>Loading files...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : files.length === 0 ? (
          <div>No files uploaded yet.</div>
        ) : (
          <div className="files-list" style={{ flexDirection: "column" }}>
            {files.map((file) => (
              <div key={file._id} className="file-item">
                <span className="file-name">{file.name}</span>
                <span
                  style={{ color: "#64748b", fontSize: 14, marginRight: 16 }}
                >
                  {file.mimetype}
                </span>
                <span
                  style={{ color: "#64748b", fontSize: 14, marginRight: 16 }}
                >
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <a
                  href={file.drive_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="view-file-btn"
                  style={{ marginRight: 8 }}
                >
                  <FaDownload />
                </a>
                <button
                  onClick={() => handleDelete(file._id)}
                  disabled={deletingId === file._id}
                  className="btn-danger"
                  style={{ minWidth: 36, minHeight: 36 }}
                >
                  {deletingId === file._id ? "" : <FaTrash />}{" "}
                  {deletingId === file._id ? "Deleting..." : ""}
                </button>
                <button
                  onClick={() => openShareModal(file)}
                  className="view-file-btn"
                  style={{ minWidth: 36, minHeight: 36, marginLeft: 8 }}
                  title="Share File"
                >
                  <FaShareAlt />
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Share Modal */}
        {showShareModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Share "{fileToShare?.name}"</h3>
              <div className="form-group">
                <label>Select friends to share with:</label>
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    margin: "1rem 0",
                  }}
                >
                  {friends.map((friend) => (
                    <div key={friend._id} style={{ marginBottom: 8 }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedFriends.includes(friend._id)}
                          onChange={() => handleFriendToggle(friend._id)}
                        />{" "}
                        {friend.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <input
                    type="email"
                    placeholder="Enter friend's email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      width: "70%",
                    }}
                  />
                  <button
                    className="btn-primary"
                    style={{ marginLeft: 8, padding: "0.5rem 1rem" }}
                    onClick={handleAddFriendByEmail}
                    disabled={!friendEmail.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-primary"
                  onClick={handleShare}
                  disabled={selectedFriends.length === 0}
                >
                  Share
                </button>
                <button className="btn-secondary" onClick={closeShareModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyFiles;
