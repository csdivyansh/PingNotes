import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.js';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!apiService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch data from multiple endpoints
      const [notesData, groupsData] = await Promise.all([
        apiService.getNotes().catch(() => []),
        apiService.getGroups().catch(() => [])
      ]);

      setNotes(notesData);
      setGroups(groupsData);
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>PingNotes Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Notes ({notes.length})</h2>
          <div style={styles.cardGrid}>
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{note.title}</h3>
                  <p style={styles.cardText}>{note.content?.substring(0, 100)}...</p>
                  <div style={styles.cardMeta}>
                    <span style={styles.metaText}>Subject: {note.subject?.name || 'N/A'}</span>
                    <span style={styles.metaText}>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No notes found</div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Groups ({groups.length})</h2>
          <div style={styles.cardGrid}>
            {groups.length > 0 ? (
              groups.map((group) => (
                <div key={group._id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{group.name}</h3>
                  <p style={styles.cardText}>{group.description}</p>
                  <div style={styles.cardMeta}>
                    <span style={styles.metaText}>Members: {group.members?.length || 0}</span>
                    <span style={styles.metaText}>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No groups found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    background: '#0078FF',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  content: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#333',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  },
  cardTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#333',
  },
  cardText: {
    color: '#666',
    margin: '0 0 1rem 0',
    lineHeight: '1.4',
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#999',
  },
  metaText: {
    background: '#f0f0f0',
    padding: '0.2rem 0.5rem',
    borderRadius: '3px',
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '2rem',
    background: 'white',
    borderRadius: '8px',
    border: '2px dashed #e0e0e0',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
    color: '#666',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '1rem',
    margin: '1rem 0',
    borderRadius: '4px',
    border: '1px solid #ffcdd2',
  },
};

export default Dashboard; 