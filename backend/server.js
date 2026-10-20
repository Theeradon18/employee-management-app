const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const { generatePortalHtml } = require("./portalHtml");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // รองรับ JSON Request Body อย่างสมบูรณ์

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// JSON Links Data
const systemLinks = {
  status: "online",
  service: "Employee Management & K-Means Salary Analysis API",
  version: "1.0.0",
  frontendUrl: "http://localhost:8081",
  backendUrl: `http://localhost:${PORT}`,
  portalUrl: `http://localhost:${PORT}/links`,
  credentials: {
    adminUsername: "admin",
    adminPassword: "admin123"
  },
  endpoints: {
    authLogin: { method: "POST", url: "/api/auth/login", desc: "Admin login (username, password)" },
    authStatus: { method: "GET", url: "/api/auth/status", desc: "Check auth service status" },
    employees: { method: "GET", url: "/api/employees", desc: "Get all employees (query: search, status)" },
    employeeById: { method: "GET", url: "/api/employees/:id", desc: "Get employee by ID" },
    createEmployee: { method: "POST", url: "/api/employees", desc: "Create new employee" },
    updateEmployee: { method: "PUT", url: "/api/employees/:id", desc: "Update employee by ID" },
    toggleStatus: { method: "PATCH", url: "/api/employees/:id/status", desc: "Toggle Active/Inactive" },
    deleteEmployee: { method: "DELETE", url: "/api/employees/:id", desc: "Delete employee by ID" },
    resetEmployees: { method: "POST", url: "/api/employees/reset", desc: "Reset data to initial 7 records" },
    kmeansAnalysis: { method: "GET", url: "/api/employees/analysis/kmeans", desc: "K-Means 3 Tiers salary analysis" },
    apiLinks: { method: "GET", url: "/api/links", desc: "All system links in JSON" }
  }
};

// GET /links หรือ /portal - หน้าเว็บรวมลิงก์ทั้งหมด (HTML Links Portal)
app.get(["/links", "/portal"], (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(generatePortalHtml());
});

// GET /api/links - รายการลิงก์ทั้งหมดในรูปแบบ JSON
app.get("/api/links", (req, res) => {
  res.json({
    success: true,
    ...systemLinks
  });
});

// Root Route: ถ้าเปิดผ่าน Browser ให้แสดงหน้า HTML Portal หรือถ้าเป็น API ให้ตอบ JSON
app.get("/", (req, res) => {
  const acceptsHtml = req.accepts(["html", "json"]) === "html";
  if (acceptsHtml) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(generatePortalHtml());
  }
  res.json(systemLinks);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `ไม่พบเส้นทาง API: ${req.method} ${req.url}`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ (Internal Server Error)",
    error: err.message
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Express.js Backend Server is running!`);
    console.log(` Port: ${PORT}`);
    console.log(` URL:  http://localhost:${PORT}`);
    console.log(` APIs: http://localhost:${PORT}/api/employees`);
    console.log(` K-Means Analysis: http://localhost:${PORT}/api/employees/analysis/kmeans`);
    console.log(`=======================================================`);
  });
}

module.exports = app;

