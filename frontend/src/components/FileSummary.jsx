import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashNav from "./DashNav.jsx";
import apiService from "../services/api";

const FileSummary = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        // Fetch file details (including name)
        const files = await apiService.getMyFiles();
        const found = files.find((f) => f._id === id);
        setFile(found);
        // Fetch/generate summary from backend
        const res = await apiService.request(`/api/files/${id}/summary`);
        setSummary(res.summary || "No summary available.");
        setError(null);
      } catch (err) {
        setError("Failed to fetch summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [id]);

  return (
    <>
      <DashNav />
      <div
        style={{
          maxWidth: 700,
          margin: "2rem auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px #e5e7eb",
          padding: 32,
        }}
      >
        {loading ? (
          <div>Loading summary...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <>
            <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>
              Summary of {file?.name || "File"}
            </h2>
            <div
              style={{ color: "#2563eb", fontSize: 18, fontStyle: "italic" }}
            >
              {summary}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FileSummary;
