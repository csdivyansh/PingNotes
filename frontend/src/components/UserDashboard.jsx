import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar.jsx";
import apiService from "../services/api.js";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newSubject, setNewSubject] = useState({ name: "", subject_code: "" });
  const [newTopic, setNewTopic] = useState({ name: "", description: "" });
  const [needsGoogleDriveAuth, setNeedsGoogleDriveAuth] = useState(false);

  useEffect(() => {
    fetchSubjects();
    checkGoogleDriveAccess();
  }, []);

  const checkGoogleDriveAccess = async () => {
    try {
      const response = await apiService.checkGoogleDriveStatus();
      setNeedsGoogleDriveAuth(!response.hasDriveAccess);
    } catch (error) {
      console.error("Error checking Google Drive access:", error);
      setNeedsGoogleDriveAuth(true);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await apiService.getSubjects();
      setSubjects(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await apiService.createSubject(newSubject);
      setNewSubject({ name: "", subject_code: "" });
      setShowAddSubject(false);
      fetchSubjects();
    } catch (error) {
      alert("Failed to create subject: " + error.message);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    try {
      await apiService.addTopic(selectedSubject._id, newTopic);
      setNewTopic({ name: "", description: "" });
      setShowAddTopic(false);
      setSelectedSubject(null);
      fetchSubjects();
    } catch (error) {
      alert("Failed to create topic: " + error.message);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a file");
      return;
    }

    console.log("Uploading file:", uploadFile.name);
    console.log("Subject ID:", selectedSubject?._id);
    console.log("Topic ID:", selectedTopic?._id);

    try {
      await apiService.uploadFile(
        uploadFile,
        (progress) => {
          setUploadProgress(progress);
        },
        selectedSubject?._id,
        selectedTopic?._id
      );

      console.log("File upload successful");
      setUploadFile(null);
      setShowUploadFile(false);
      setUploadProgress(0);
      fetchSubjects();
    } catch (error) {
      console.error("File upload error:", error);
      if (error.message.includes("401") || error.message.includes("Google")) {
        setNeedsGoogleDriveAuth(true);
        alert(
          "You need to authorize Google Drive access to upload files. Please click the 'Authorize Google Drive' button."
        );
      } else {
        alert("Failed to upload file: " + error.message);
      }
    }
  };

  const handleGoogleDriveAuth = async () => {
    try {
      // Redirect to Google OAuth for Drive access
      const role = localStorage.getItem("userRole") || "user";
      const authUrl = `http://localhost:5000/api/auth/google/${role}`;
      window.location.href = authUrl;
    } catch (error) {
      console.error("Google Drive auth error:", error);
      alert("Failed to authorize Google Drive: " + error.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
  };

  const handleDeleteSubject = async (subjectId) => {
    setSubjectToDelete(subjectId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubject = async () => {
    try {
      await apiService.deleteSubject(subjectToDelete);
      setShowDeleteConfirm(false);
      setSubjectToDelete(null);
      fetchSubjects(); // Refresh the subjects list
    } catch (error) {
      alert("Failed to delete subject: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading">Loading subjects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <UserSidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>My Subjects ({subjects.length})</h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            {needsGoogleDriveAuth && (
              <button
                className="google-drive-auth-btn"
                onClick={handleGoogleDriveAuth}
                style={{
                  background: "#4285f4",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🔗 Authorize Google Drive
              </button>
            )}
            <button
              className="add-subject-btn"
              onClick={() => setShowAddSubject(true)}
            >
              + Add Subject
            </button>
          </div>
        </header>

        {needsGoogleDriveAuth && (
          <div
            className="google-drive-notice"
            style={{
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "1rem",
              color: "#856404",
            }}
          >
            <p>
              <strong>Google Drive Access Required</strong>
            </p>
            <p>
              To upload files, you need to authorize Google Drive access. Click
              the "Authorize Google Drive" button above.
            </p>
          </div>
        )}

        <div className="subjects-grid">
          {subjects.length === 0 ? (
            <div className="no-subjects">
              <p>No subjects yet. Create your first subject!</p>
              <button
                className="add-subject-btn"
                onClick={() => setShowAddSubject(true)}
                style={{ marginTop: "1rem" }}
              >
                + Create Your First Subject
              </button>
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject._id} className="subject-card">
                <div className="subject-header">
                  <h3>{subject.name}</h3>
                  <span className="subject-code">{subject.subject_code}</span>
                  <button
                    className="delete-subject-btn"
                    onClick={() => handleDeleteSubject(subject._id)}
                    title="Delete subject"
                  >
                    🗑️
                  </button>
                </div>

                <div className="topics-section">
                  <div className="topics-header">
                    <h4>Topics</h4>
                    <button
                      className="add-topic-btn"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setShowAddTopic(true);
                      }}
                    >
                      + Add Topic
                    </button>
                  </div>

                  {subject.topics && subject.topics.length > 0 ? (
                    <div className="topics-list">
                      {subject.topics.map((topic) => (
                        <div key={topic._id} className="topic-item">
                          <div className="topic-info">
                            <h5>{topic.name}</h5>
                            {topic.description && (
                              <p className="topic-description">
                                {topic.description}
                              </p>
                            )}
                          </div>

                          <div className="topic-actions">
                            <button
                              className="upload-file-btn"
                              onClick={() => {
                                setSelectedSubject(subject);
                                setSelectedTopic(topic);
                                setShowUploadFile(true);
                              }}
                            >
                              Upload File
                            </button>

                            {topic.files && topic.files.length > 0 && (
                              <div className="files-list">
                                {topic.files.map((file) => (
                                  <div key={file._id} className="file-item">
                                    <span className="file-name">
                                      {file.name}
                                    </span>
                                    <a
                                      href={file.drive_file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="view-file-btn"
                                    >
                                      View
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-topics">
                      No topics yet. Add your first topic!
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Subject</h3>
            <form onSubmit={handleAddSubject}>
              <div className="form-group">
                <label>Subject Name:</label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject Code:</label>
                <input
                  type="text"
                  value={newSubject.subject_code}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      subject_code: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Add Subject
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddSubject(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopic && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Topic to {selectedSubject?.name}</h3>
            <form onSubmit={handleAddTopic}>
              <div className="form-group">
                <label>Topic Name:</label>
                <input
                  type="text"
                  value={newTopic.name}
                  onChange={(e) =>
                    setNewTopic({ ...newTopic, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (Optional):</label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) =>
                    setNewTopic({ ...newTopic, description: e.target.value })
                  }
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Add Topic
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddTopic(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadFile && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              Upload File to {selectedSubject?.name} - {selectedTopic?.name}
            </h3>
            <form onSubmit={handleFileUpload}>
              <div className="form-group">
                <label>Select File:</label>
                <input type="file" onChange={handleFileChange} required />
              </div>
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
              )}
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Upload File
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowUploadFile(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Subject</h3>
            <p>
              Are you sure you want to delete this subject? This action cannot
              be undone.
            </p>
            <div className="modal-actions">
              <button onClick={confirmDeleteSubject} className="btn-danger">
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
