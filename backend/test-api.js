/**
 * Automated Verification Script for Express Backend & K-Means
 */
const { getEmployees, resetToInitialData } = require("./data/employeesData");
const { runKMeansSalaryAnalysis } = require("./utils/kmeans");

async function runTests() {
  console.log("=================================================");
  console.log("  Running Automated Tests for Employee System    ");
  console.log("=================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  // 1. ตรวจสอบข้อมูลเริ่มต้นต้องมีอย่างน้อย 5 คน
  resetToInitialData();
  const initial = getEmployees();
  assert(initial.length >= 5, `Initial employees must be at least 5 (Found: ${initial.length})`);

  // 2. ตรวจสอบฟังก์ชัน K-Means Salary Clustering
  const analysis = runKMeansSalaryAnalysis(initial, 3);
  assert(analysis.success === true, "K-Means analysis must return success: true");
  assert(analysis.tiers.length === 3, `K-Means must cluster into 3 tiers (Found: ${analysis.tiers.length})`);
  assert(analysis.tiers[0].tierName.includes("Tier 1"), "First tier is Tier 1");
  assert(analysis.tiers[1].tierName.includes("Tier 2"), "Second tier is Tier 2");
  assert(analysis.tiers[2].tierName.includes("Tier 3"), "Third tier is Tier 3");

  // ตรวจสอบว่าแต่ละ Tier มีการคำนวณ averageSalary และ count
  analysis.tiers.forEach((tier, i) => {
    assert(typeof tier.averageSalary === "number" && tier.averageSalary > 0, `${tier.tierName} has valid averageSalary: ${tier.averageSalary}`);
    assert(typeof tier.count === "number" && tier.count > 0, `${tier.tierName} has valid count: ${tier.count}`);
    assert(Array.isArray(tier.employees) && tier.employees.length === tier.count, `${tier.tierName} contains employee list matching count`);
  });

  // ตรวจสอบการเรียงลำดับ Tier 1 (High) > Tier 2 (Mid) > Tier 3 (Entry)
  assert(
    analysis.tiers[0].averageSalary >= analysis.tiers[1].averageSalary &&
    analysis.tiers[1].averageSalary >= analysis.tiers[2].averageSalary,
    `Tiers are sorted properly by salary: Tier 1 (${analysis.tiers[0].averageSalary}) >= Tier 2 (${analysis.tiers[1].averageSalary}) >= Tier 3 (${analysis.tiers[2].averageSalary})`
  );

  console.log("\n--- K-Means Clustering Result Preview (JSON) ---");
  console.log(JSON.stringify({
    overall: analysis.overallStats,
    tiers: analysis.tiers.map(t => ({
      tier: t.tierName,
      avg: t.averageSalary,
      count: t.count,
      employees: t.employees.map(e => `${e.name} (${e.salary.toLocaleString()} THB)`)
    }))
  }, null, 2));

  // 3. ทดสอบ CRUD In-Memory
  const { addEmployee, updateEmployee, toggleEmployeeStatus, deleteEmployee } = require("./data/employeesData");
  
  // เพิ่มพนักงานใหม่
  const newEmp = addEmployee({
    name: "ทดสอบ สมมุติ (Test User)",
    position: "QA Tester",
    salary: 40000,
    status: "Active"
  });
  assert(newEmp.id !== undefined && newEmp.name.includes("Test User"), `Add employee works (ID: ${newEmp.id})`);

  // เปลี่ยนสถานะพนักงาน
  const toggled = toggleEmployeeStatus(newEmp.id);
  assert(toggled.status === "Inactive", `Toggle status works (Changed to: ${toggled.status})`);

  const toggledBack = toggleEmployeeStatus(newEmp.id, "Active");
  assert(toggledBack.status === "Active", `Set status explicitly works (Changed to: ${toggledBack.status})`);

  // แก้ไขพนักงาน
  const updated = updateEmployee(newEmp.id, { salary: 45000 });
  assert(updated.salary === 45000, `Update employee salary works (New salary: ${updated.salary})`);

  // ลบพนักงาน
  const deleted = deleteEmployee(newEmp.id);
  assert(deleted === true, "Delete employee works");

  console.log("=================================================");
  console.log(` Test Summary: ${passed}/${total} passed (${((passed/total)*100).toFixed(0)}%)`);
  console.log("=================================================");

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();

