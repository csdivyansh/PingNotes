import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import { FaDownload, FaTrash } from "react-icons/fa";

const MyFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  return (
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
              <span style={{ color: "#64748b", fontSize: 14, marginRight: 16 }}>
                {file.mimetype}
              </span>
              <span style={{ color: "#64748b", fontSize: 14, marginRight: 16 }}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFiles;
