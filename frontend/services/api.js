/**
 * API Service for connecting to Express.js Backend
 * Base URL: http://localhost:5000/api
 */

const API_BASE_URL = "http://localhost:5000/api";

const defaultHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json"
};

export const apiService = {
  // --- AUTHENTICATION ---
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  },

  // --- EMPLOYEES CRUD ---
  getEmployees: async (search = "", status = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status && status !== "All") params.append("status", status);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await fetch(`${API_BASE_URL}/employees${query}`, {
      method: "GET",
      headers: defaultHeaders
    });
    return await response.json();
  },

  getEmployeeById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "GET",
      headers: defaultHeaders
    });
    return await response.json();
  },

  addEmployee: async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(employeeData)
    });
    return await response.json();
  },

  updateEmployee: async (id, employeeData) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(employeeData)
    });
    return await response.json();
  },

  toggleEmployeeStatus: async (id, status = null) => {
    const payload = status ? { status } : {};
    const response = await fetch(`${API_BASE_URL}/employees/${id}/status`, {
      method: "PATCH",
      headers: defaultHeaders,
      body: JSON.stringify(payload)
    });
    return await response.json();
  },

  deleteEmployee: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: defaultHeaders
    });
    return await response.json();
  },

  resetEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/employees/reset`, {
      method: "POST",
      headers: defaultHeaders
    });
    return await response.json();
  },

  // --- K-MEANS SALARY ANALYSIS ---
  getKMeansAnalysis: async (k = 3) => {
    const response = await fetch(`${API_BASE_URL}/employees/analysis/kmeans?k=${k}`, {
      method: "GET",
      headers: defaultHeaders
    });
    return await response.json();
  }
};

