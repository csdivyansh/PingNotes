import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import { FaEllipsisV } from "react-icons/fa";
import DashNav from "./DashNav.jsx";
import { useNavigate } from "react-router-dom";
import FileSummary from "./FileSummary";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [summaryVisible, setSummaryVisible] = useState({});
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryFileId, setSummaryFileId] = useState(null);
  // Placeholder: friends list and selected friends
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const navigate = useNavigate();

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

  const handleDelete = (fileId) => {
    if (!fileId) {
      setModalMessage("Invalid file ID");
      setModalOpen(true);
      return;
    }
    setConfirmMessage("Are you sure you want to delete this file?");
    setOnConfirm(() => () => handleDeleteConfirmed(fileId));
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async (fileId) => {
    setDeletingId(fileId);
    try {
      await apiService.request(`/api/files/${fileId}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      setModalMessage("Failed to delete file");
      setModalOpen(true);
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

  const handleMenuToggle = (fileId) => {
    setMenuOpenId((prev) => (prev === fileId ? null : fileId));
  };

  // Placeholder for AI summary fetching logic
  const getAISummary = (file) => {
    // TODO: Replace with real AI summary fetching logic
    return "This is an AI-generated summary of the file. (Placeholder)";
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
              <div
                key={file._id}
                className="file-item"
                style={{
                  marginRight: "10%",
                  position: "relative",
                  marginBottom: 24,
                  padding: 16,
                  border: "1px solid #eee",
                  borderRadius: 8,
                }}
              >
                <span className="file-name" style={{ fontWeight: 600 }}>
                  {file.name}
                </span>
                <span
                  style={{ color: "#64748b", fontSize: 14, marginLeft: 12 }}
                >
                  {file.mimetype}
                </span>
                <span
                  style={{ color: "#64748b", fontSize: 14, marginLeft: 12, marginRight: 30 }}
                >
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                {/* 3-dots menu */}
                <button
                  className="file-menu-btn"
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 20,
                  }}
                  onClick={() => handleMenuToggle(file._id)}
                  aria-label="File actions"
                >
                  <FaEllipsisV />
                </button>
                {menuOpenId === file._id && (
                  <div
                    className="file-menu-dropdown"
                    style={{
                      position: "absolute",
                      top: 44,
                      right: 16,
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      zIndex: 10,
                      minWidth: 140,
                    }}
                  >
                    <button
                      onClick={() => {
                        navigate(`/files/${file._id}/view`);
                        setMenuOpenId(null);
                      }}
                      className="file-menu-item"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 18px",
                        color: "#222",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      disabled={deletingId === file._id}
                      className="file-menu-item"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 18px",
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                    >
                      {deletingId === file._id ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      onClick={() => openShareModal(file)}
                      className="file-menu-item"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 18px",
                        color: "#2563eb",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                    >
                      Share
                    </button>
                    <button
                      onClick={() => {
                        setSummaryFileId(file._id);
                        setShowSummaryModal(true);
                        setMenuOpenId(null);
                      }}
                      className="file-menu-item"
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 18px",
                        color: "#2563eb",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      AI Summary
                    </button>
                  </div>
                )}
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
        {/* Summary Modal */}
        {showSummaryModal && summaryFileId && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target.classList.contains("modal-overlay")) {
                setShowSummaryModal(false);
                setSummaryFileId(null);
              }
            }}
          >
            <div style={{ maxWidth: 700, width: "95%", padding: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: 8,
                }}
              >
                <button
                  onClick={() => {
                    setShowSummaryModal(false);
                    setSummaryFileId(null);
                  }}
                  style={{
                    fontSize: 22,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>
              <div style={{ padding: 24 }}>
                <FileSummary fileId={summaryFileId} />
              </div>
            </div>
          </div>
        )}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <p>{modalMessage}</p>
              <button onClick={() => setModalOpen(false)} className="btn-primary">Close</button>
            </div>
          </div>
        )}
        {confirmOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <p>{confirmMessage}</p>
              <button onClick={() => { onConfirm(); setConfirmOpen(false); }} className="btn-danger">Yes</button>
              <button onClick={() => setConfirmOpen(false)} className="btn-secondary">No</button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .file-menu-btn:focus + .file-menu-dropdown,
        .file-menu-dropdown:hover {
          display: block;
        }
        .file-menu-dropdown {
          display: block;
        }
      `}</style>
    </>
  );
};

export default MyFiles;
