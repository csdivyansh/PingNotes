import React, { createContext, useContext, useState } from "react";
import apiService from "../services/api";

const GlobalFileUploadContext = createContext();

export function useGlobalFileUpload() {
  return useContext(GlobalFileUploadContext);
}

export function GlobalFileUploadProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [suggestedSubject, setSuggestedSubject] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [loading, setLoading] = useState(false);

  const openUploadModal = () => setShowModal(true);
  const closeUploadModal = () => {
    setShowModal(false);
    setUploadFile(null);
    setUploadProgress(0);
    setSuggestedSubject("");
    setSubjectInput("");
    setUploadedFileId(null);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setLoading(true);
    try {
      const response = await apiService.uploadFile(uploadFile, (progress) =>
        setUploadProgress(progress)
      );
      console.log("Upload response:", response); // Debug log
      if (response.suggestedSubject) {
        setSuggestedSubject(response.suggestedSubject);
        setSubjectInput(response.suggestedSubject);
        setUploadedFileId(response.files && response.files[0]?._id);
      }
    } catch (err) {
      alert("File upload failed");
      closeUploadModal();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubject = async () => {
    if (!subjectInput || !uploadedFileId) return;
    setLoading(true);
    try {
      await apiService.createSubjectAndLinkFile({
        subjectName: subjectInput,
        fileId: uploadedFileId,
      });
      closeUploadModal();
      window.location.reload(); // Refresh to show new subject/file
    } catch (err) {
      alert("Failed to create/associate subject");
      setLoading(false);
    }
  };

  return (
    <GlobalFileUploadContext.Provider
      value={{
        showModal,
        openUploadModal,
        closeUploadModal,
        uploadFile,
        setUploadFile,
        uploadProgress,
        handleFileChange,
        handleFileUpload,
        suggestedSubject,
        subjectInput,
        setSubjectInput,
        handleConfirmSubject,
        loading,
      }}
    >
      {children}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upload File & Confirm Subject</h3>
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
              {/* Show AI loading message if file is uploaded but suggestion not ready */}
              {uploadFile && !suggestedSubject && loading && (
                <div
                  style={{
                    margin: "1rem 0",
                    color: "#3b82f6",
                    fontWeight: 500,
                  }}
                >
                  Using AI to get file subject...
                </div>
              )}
              {/* Show AI suggestion if available */}
              {suggestedSubject && (
                <div className="form-group">
                  <label>AI Thinks the subject is:</label>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="modal-actions">
                {!suggestedSubject ? (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload File"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleConfirmSubject}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Confirm Subject"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeUploadModal}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GlobalFileUploadContext.Provider>
  );
}
