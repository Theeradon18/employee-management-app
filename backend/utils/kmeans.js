/**
 * อัลกอริทึม K-Means Clustering (1D) สำหรับวิเคราะห์กลุ่มเงินเดือนพนักงาน
 * แบ่งเป็น 3 กลุ่ม (k = 3): Tier 1, Tier 2, Tier 3
 */

function runKMeansSalaryAnalysis(employees, k = 3) {
  if (!employees || employees.length === 0) {
    return {
      success: false,
      message: "ไม่มีข้อมูลพนักงานสำหรับการวิเคราะห์",
      tiers: [],
      overallStats: {}
    };
  }

  // ดึงค่าเงินเดือนของพนักงาน
  const validEmployees = employees.filter(
    (emp) => typeof emp.salary === "number" && !isNaN(emp.salary)
  );

  if (validEmployees.length === 0) {
    return {
      success: false,
      message: "ไม่พบข้อมูลเงินเดือนที่ถูกต้อง",
      tiers: [],
      overallStats: {}
    };
  }

  // หากพนักงานมีน้อยกว่าจำนวนกลุ่ม k ให้ปรับ k ลงเท่าจำนวนพนักงาน
  const actualK = Math.min(k, validEmployees.length);

  // เรียงลำดับเงินเดือนจากน้อยไปมากเพื่อการตั้งค่าเริ่มต้น (Initialization)
  const sortedSalaries = [...validEmployees.map((e) => e.salary)].sort((a, b) => a - b);
  const minSalary = sortedSalaries[0];
  const maxSalary = sortedSalaries[sortedSalaries.length - 1];

  // กำหนด Centroids เริ่มต้นให้กระจายตัวอย่างเหมาะสม
  let centroids = [];
  if (actualK === 1) {
    centroids = [sortedSalaries[Math.floor(sortedSalaries.length / 2)]];
  } else if (actualK === 2) {
    centroids = [minSalary, maxSalary];
  } else {
    // k = 3: Min, Median, Max หรือแบ่งตาม Percentile
    const p1 = sortedSalaries[Math.floor(sortedSalaries.length * 0.2)];
    const p2 = sortedSalaries[Math.floor(sortedSalaries.length * 0.5)];
    const p3 = sortedSalaries[Math.floor(sortedSalaries.length * 0.8)];
    centroids = [p1, p2, p3];
  }

  // ตัวแปรสำหรับรอบการคำนวณ K-Means
  const maxIterations = 100;
  let iterations = 0;
  let clusters = [];

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations++;
    // สร้างกลุ่มว่างตามจำนวน k
    clusters = Array.from({ length: actualK }, () => []);

    // 1. กำหนดแต่ละพนักงานไปยัง Centroid ที่ใกล้เคียงที่สุด (Nearest Centroid)
    for (const emp of validEmployees) {
      let nearestIndex = 0;
      let minDistance = Math.abs(emp.salary - centroids[0]);

      for (let j = 1; j < centroids.length; j++) {
        const distance = Math.abs(emp.salary - centroids[j]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = j;
        }
      }

      clusters[nearestIndex].push(emp);
    }

    // 2. คำนวณค่า Centroid ใหม่จากค่าเฉลี่ยของสมาชิกในกลุ่ม
    let centroidsChanged = false;
    const newCentroids = [];

    for (let j = 0; j < actualK; j++) {
      if (clusters[j].length > 0) {
        const sum = clusters[j].reduce((acc, curr) => acc + curr.salary, 0);
        const newCentroid = sum / clusters[j].length;
        newCentroids.push(newCentroid);

        if (Math.abs(newCentroid - centroids[j]) > 0.01) {
          centroidsChanged = true;
        }
      } else {
        // หากกลุ่มว่าง คงค่าเดิมไว้
        newCentroids.push(centroids[j]);
      }
    }

    centroids = newCentroids;

    // ถ้าไม่มีการเปลี่ยนแปลง Centroid ถือว่าลู่เข้าสู่จุดสมดุลแล้ว (Converged)
    if (!centroidsChanged) {
      break;
    }
  }

  // รวมข้อมูลของแต่ละ Cluster พร้อมคำนวณสถิติ
  const clusterSummaries = clusters.map((clusterEmployees, idx) => {
    const count = clusterEmployees.length;
    if (count === 0) {
      return {
        clusterIndex: idx,
        centroid: centroids[idx],
        count: 0,
        averageSalary: 0,
        minSalary: 0,
        maxSalary: 0,
        employees: []
      };
    }

    const salaries = clusterEmployees.map((e) => e.salary);
    const sum = salaries.reduce((acc, val) => acc + val, 0);
    const avg = Math.round(sum / count);
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);

    return {
      clusterIndex: idx,
      centroid: centroids[idx],
      count,
      averageSalary: avg,
      minSalary: min,
      maxSalary: max,
      employees: clusterEmployees
    };
  });

  // เรียงลำดับตามค่าเงินเดือนเฉลี่ยจาก มาก -> น้อย
  // Tier 1 = กลุ่มเงินเดือนสูง (High)
  // Tier 2 = กลุ่มเงินเดือนกลาง (Mid)
  // Tier 3 = กลุ่มเงินเดือนเริ่มต้น/ต่ำ (Entry/Low)
  clusterSummaries.sort((a, b) => b.averageSalary - a.averageSalary);

  const tierLabels = [
    { name: "Tier 1 (High)", desc: "เงินเดือนระดับสูง (Senior / Executive / Specialist)", color: "#10B981" },
    { name: "Tier 2 (Mid)", desc: "เงินเดือนระดับกลาง (Mid-Level / Professional)", color: "#3B82F6" },
    { name: "Tier 3 (Entry)", desc: "เงินเดือนระดับเริ่มต้น (Junior / Support / Entry)", color: "#F59E0B" }
  ];

  const tiers = clusterSummaries.map((summary, index) => {
    const label = tierLabels[index] || {
      name: `Tier ${index + 1}`,
      desc: `กลุ่มเงินเดือนอันดับที่ ${index + 1}`,
      color: "#6B7280"
    };

    return {
      tierKey: `tier_${index + 1}`,
      tierName: label.name,
      description: label.desc,
      color: label.color,
      count: summary.count,
      percentage: ((summary.count / validEmployees.length) * 100).toFixed(1) + "%",
      averageSalary: summary.averageSalary,
      minSalary: summary.minSalary,
      maxSalary: summary.maxSalary,
      centroid: Math.round(summary.centroid),
      employees: summary.employees
    };
  });

  // สถิติรวมทั้งหมด
  const totalSalaries = validEmployees.reduce((acc, curr) => acc + curr.salary, 0);
  const overallAverage = Math.round(totalSalaries / validEmployees.length);

  return {
    success: true,
    algorithm: "K-Means Clustering (1D)",
    k: actualK,
    iterationsRun: iterations,
    timestamp: new Date().toISOString(),
    overallStats: {
      totalEmployees: validEmployees.length,
      overallAverageSalary: overallAverage,
      minSalary: minSalary,
      maxSalary: maxSalary,
      totalPayroll: totalSalaries
    },
    tiers
  };
}

module.exports = {
  runKMeansSalaryAnalysis
};

