const API_BASE_URL = import.meta.env.VITE_API_URL || "";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with authentication
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    // Add auth token if available
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("userToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async adminLogin(email, password) {
    return this.request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async userLogin(email, password) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async userRegister(userData) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getUsers() {
    return this.request("/api/users");
  }

  async getUserById(id) {
    return this.request(`/api/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Group endpoints
  async getGroups() {
    return this.request("/api/groups");
  }

  async createGroup(groupData) {
    return this.request("/api/groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    });
  }

  // Note endpoints
  async getNotes() {
    return this.request("/api/notes");
  }

  async createNote(noteData) {
    return this.request("/api/notes", {
      method: "POST",
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id, noteData) {
    return this.request(`/api/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id) {
    return this.request(`/api/notes/${id}`, {
      method: "DELETE",
    });
  }

  // Subject endpoints
  async getSubjects() {
    return this.request("/api/subjects");
  }

  async createSubject(subjectData) {
    return this.request("/api/subjects", {
      method: "POST",
      body: JSON.stringify(subjectData),
    });
  }

  async deleteSubject(subjectId) {
    return this.request(`/api/subjects/${subjectId}`, {
      method: "DELETE",
    });
  }

  // Topic endpoints
  async addTopic(subjectId, topicData) {
    return this.request(`/api/subjects/${subjectId}/topics`, {
      method: "POST",
      body: JSON.stringify(topicData),
    });
  }

  async updateTopic(subjectId, topicId, topicData) {
    return this.request(`/api/subjects/${subjectId}/topics/${topicId}`, {
      method: "PUT",
      body: JSON.stringify(topicData),
    });
  }

  async deleteTopic(subjectId, topicId) {
    return this.request(`/api/subjects/${subjectId}/topics/${topicId}`, {
      method: "DELETE",
    });
  }

  // Teacher endpoints
  async getTeachers() {
    return this.request("/api/teachers");
  }

  async createTeacher(teacherData) {
    return this.request("/api/teachers", {
      method: "POST",
      body: JSON.stringify(teacherData),
    });
  }

  // File endpoints
  async uploadFile(file, onProgress, subjectId = null, topicId = null) {
    const formData = new FormData();
    formData.append("file", file);

    if (subjectId) {
      formData.append("subject_id", subjectId);
    }
    if (topicId) {
      formData.append("topic_id", topicId);
    }

    const url = `${this.baseURL}/api/files/upload`;
    const headers = {};

    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("userToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error("Invalid JSON response"));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", url);
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
      xhr.send(formData);
    });
  }

  // Check if user has Google Drive access
  async checkGoogleDriveStatus() {
    return this.request("/api/auth/google/drive/status");
  }

  // Logout
  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(
      localStorage.getItem("adminToken") || localStorage.getItem("userToken")
    );
  }
}

export default new ApiService();
