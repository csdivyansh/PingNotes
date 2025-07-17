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
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1>My Files</h1>
      {loading ? (
        <div>Loading files...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : files.length === 0 ? (
        <div>No files uploaded yet.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>File Name</th>
              <th style={{ textAlign: "left", padding: 8 }}>Type</th>
              <th style={{ textAlign: "left", padding: 8 }}>Size</th>
              <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{file.name}</td>
                <td style={{ padding: 8 }}>{file.mimetype}</td>
                <td style={{ padding: 8 }}>
                  {(file.size / 1024).toFixed(1)} KB
                </td>
                <td style={{ padding: 8 }}>
                  <a
                    href={file.drive_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{ marginRight: 16 }}
                  >
                    <FaDownload />
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    disabled={deletingId === file._id}
                    style={{
                      color: "white",
                      background: "#ef4444",
                      border: "none",
                      borderRadius: 4,
                      padding: "4px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {deletingId === file._id ? "" : <FaTrash />}{" "}
                    {deletingId === file._id ? "Deleting..." : ""}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyFiles;
