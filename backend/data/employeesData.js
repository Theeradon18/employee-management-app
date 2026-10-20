// ข้อมูลเริ่มต้นสำหรับจำลอง In-Memory Database (อย่างน้อย 5 คน)
const initialEmployees = [
  {
    id: 1,
    name: "สมชาย ใจดี (Somchai Jaidee)",
    position: "Senior Software Engineer",
    department: "Engineering",
    salary: 75000,
    status: "Active", // Active, Inactive
    email: "somchai.j@company.com",
    createdAt: "2024-01-15T08:30:00.000Z"
  },
  {
    id: 2,
    name: "สุดา รักเรียน (Suda Rakrian)",
    position: "Junior Developer",
    department: "Engineering",
    salary: 28000,
    status: "Active",
    email: "suda.r@company.com",
    createdAt: "2024-06-01T09:00:00.000Z"
  },
  {
    id: 3,
    name: "วิชัย มีสุข (Wichai Meesook)",
    position: "DevOps Engineer",
    department: "Infrastructure",
    salary: 62000,
    status: "Active",
    email: "wichai.m@company.com",
    createdAt: "2024-03-10T10:15:00.000Z"
  },
  {
    id: 4,
    name: "อนงค์ เพชรแก้ว (Anong Petchkaew)",
    position: "VP of Technology / Executive",
    department: "Management",
    salary: 160000,
    status: "Active",
    email: "anong.p@company.com",
    createdAt: "2023-08-20T08:00:00.000Z"
  },
  {
    id: 5,
    name: "กิตติศักดิ์ ชัยชนะ (Kittisak Chaichana)",
    position: "Administrative Assistant",
    department: "Operations",
    salary: 24000,
    status: "Inactive",
    email: "kittisak.c@company.com",
    createdAt: "2024-07-05T11:00:00.000Z"
  },
  {
    id: 6,
    name: "พิมพ์ชนก สุวรรณ (Pimchanok Suwan)",
    position: "Chief Operating Officer",
    department: "Management",
    salary: 190000,
    status: "Active",
    email: "pimchanok.s@company.com",
    createdAt: "2023-05-12T08:45:00.000Z"
  },
  {
    id: 7,
    name: "นราธิป มณีรัตน์ (Narathip Maneerat)",
    position: "Data Analyst & Specialist",
    department: "Data & AI",
    salary: 58000,
    status: "Active",
    email: "narathip.m@company.com",
    createdAt: "2024-02-18T09:30:00.000Z"
  }
];

// In-Memory Store
let employees = JSON.parse(JSON.stringify(initialEmployees));
let nextId = 8;

const getEmployees = () => employees;

const getEmployeeById = (id) => employees.find((emp) => emp.id === Number(id));

const addEmployee = (data) => {
  const newEmployee = {
    id: nextId++,
    name: data.name || "Unnamed Employee",
    position: data.position || "Staff",
    department: data.department || "General",
    salary: Number(data.salary) || 0,
    status: data.status || "Active",
    email: data.email || `employee${nextId}@company.com`,
    createdAt: new Date().toISOString()
  };
  employees.push(newEmployee);
  return newEmployee;
};

const updateEmployee = (id, data) => {
  const index = employees.findIndex((emp) => emp.id === Number(id));
  if (index === -1) return null;

  employees[index] = {
    ...employees[index],
    ...data,
    id: Number(id), // ID ห้ามเปลี่ยน
    salary: data.salary !== undefined ? Number(data.salary) : employees[index].salary
  };
  return employees[index];
};

const toggleEmployeeStatus = (id, newStatus) => {
  const index = employees.findIndex((emp) => emp.id === Number(id));
  if (index === -1) return null;

  if (newStatus) {
    employees[index].status = newStatus;
  } else {
    // สลับ Active <-> Inactive
    employees[index].status = employees[index].status === "Active" ? "Inactive" : "Active";
  }
  return employees[index];
};

const deleteEmployee = (id) => {
  const index = employees.findIndex((emp) => emp.id === Number(id));
  if (index === -1) return false;
  employees.splice(index, 1);
  return true;
};

const resetToInitialData = () => {
  employees = JSON.parse(JSON.stringify(initialEmployees));
  nextId = 8;
  return employees;
};

module.exports = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  deleteEmployee,
  resetToInitialData
};

