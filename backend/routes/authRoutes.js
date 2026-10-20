const express = require("express");
const router = express.Router();

// กำหนด Credential เริ่มต้นสำหรับ Admin
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123" // และยอมรับ "admin" เผื่อกรณีพิมพ์แบบสั้น
};

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "กรุณาระบุ Username และ Password"
    });
  }

  const isUsernameMatch = username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase();
  const isPasswordMatch = password === ADMIN_CREDENTIALS.password || password === "admin";

  if (isUsernameMatch && isPasswordMatch) {
    return res.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token: "session-token-admin-" + Date.now(),
      user: {
        username: "admin",
        role: "System Administrator",
        name: "ผู้ดูแลระบบ (Admin)",
        loginAt: new Date().toISOString()
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Username หรือ Password ไม่ถูกต้อง)"
  });
});

// GET /api/auth/status
router.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Auth Service ทำงานปกติ",
    adminUsername: "admin"
  });
});

module.exports = router;

