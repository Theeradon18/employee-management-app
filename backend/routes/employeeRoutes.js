const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
  resetToInitialData
} = require("../data/employeesData");
const { runKMeansSalaryAnalysis } = require("../utils/kmeans");

// GET /api/employees - แสดงรายชื่อพนักงานทั้งหมด (รองรับ Search & Filter)
router.get("/", (req, res) => {
  const { search, status } = req.query;
  let list = getEmployees();

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.position.toLowerCase().includes(q) ||
        (emp.department && emp.department.toLowerCase().includes(q))
    );
  }

  if (status && status !== "All") {
    list = list.filter((emp) => emp.status.toLowerCase() === status.toLowerCase());
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// GET /api/employees/analysis/kmeans - วิเคราะห์กลุ่มเงินเดือนด้วย K-Means (แบ่ง 3 Tier)
router.get("/analysis/kmeans", (req, res) => {
  const allEmployees = getEmployees();
  const k = req.query.k ? parseInt(req.query.k) : 3;
  const analysisResult = runKMeansSalaryAnalysis(allEmployees, k);

  res.json(analysisResult);
});

// POST /api/employees/reset - รีเซ็ตข้อมูลกลับเป็นตัวอย่างเริ่มต้น (อย่างน้อย 5 คน)
router.post("/reset", (req, res) => {
  const initial = resetToInitialData();
  res.json({
    success: true,
    message: "รีเซ็ตข้อมูลพนักงานกลับเป็นตัวอย่างเริ่มต้นเรียบร้อยแล้ว",
    count: initial.length,
    data: initial
  });
});

// GET /api/employees/:id - แสดงข้อมูลพนักงานตาม ID
router.get("/:id", (req, res) => {
  const employee = getEmployeeById(req.params.id);
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: `ไม่พบพนักงานรหัส ${req.params.id}`
    });
  }

  res.json({
    success: true,
    data: employee
  });
});

// POST /api/employees - เพิ่มพนักงานใหม่ (Create)
router.post("/", (req, res) => {
  const { name, position, department, salary, status, email } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "กรุณาระบุชื่อพนักงาน (Name)"
    });
  }

  if (salary === undefined || isNaN(salary) || Number(salary) < 0) {
    return res.status(400).json({
      success: false,
      message: "กรุณาระบุเงินเดือนที่ถูกต้อง (Salary ต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0)"
    });
  }

  const created = addEmployee({
    name: name.trim(),
    position: position || "Staff",
    department: department || "General",
    salary: Number(salary),
    status: status || "Active",
    email: email || ""
  });

  res.status(201).json({
    success: true,
    message: "เพิ่มข้อมูลพนักงานสำเร็จ",
    data: created
  });
});

// PUT /api/employees/:id - แก้ไขข้อมูลพนักงาน (Update)
router.put("/:id", (req, res) => {
  const updated = updateEmployee(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `ไม่พบพนักงานรหัส ${req.params.id}`
    });
  }

  res.json({
    success: true,
    message: "อัปเดตข้อมูลพนักงานสำเร็จ",
    data: updated
  });
});

// PATCH /api/employees/:id/status - เปลี่ยนสถานะพนักงาน (Active / Inactive)
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;
  const updated = toggleEmployeeStatus(req.params.id, status);

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `ไม่พบพนักงานรหัส ${req.params.id}`
    });
  }

  res.json({
    success: true,
    message: `เปลี่ยนสถานะพนักงานเป็น ${updated.status} สำเร็จ`,
    data: updated
  });
});

// DELETE /api/employees/:id - ลบพนักงาน (Delete)
router.delete("/:id", (req, res) => {
  const success = deleteEmployee(req.params.id);
  if (!success) {
    return res.status(404).json({
      success: false,
      message: `ไม่พบพนักงานรหัส ${req.params.id}`
    });
  }

  res.json({
    success: true,
    message: `ลบพนักงานรหัส ${req.params.id} สำเร็จ`
  });
});

module.exports = router;

