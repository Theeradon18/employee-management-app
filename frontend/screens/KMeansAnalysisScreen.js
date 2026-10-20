import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { apiService } from "../services/api";

export default function KMeansAnalysisScreen({ onBackToEmployees }) {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showJsonView, setShowJsonView] = useState(false);

  const fetchKMeans = async () => {
    try {
      setLoading(true);
      const res = await apiService.getKMeansAnalysis(3);
      if (res.success) {
        setAnalysisData(res);
      }
    } catch (err) {
      console.error("Fetch KMeans analysis error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKMeans();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchKMeans();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>กำลังประมวลผล K-Means Clustering (3 Tiers)...</Text>
      </View>
    );
  }

  const tiers = analysisData?.tiers || [];
  const overall = analysisData?.overallStats || {};
  const maxAvgSalary = Math.max(...tiers.map((t) => t.averageSalary), 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity onPress={onBackToEmployees} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← กลับหน้ารายชื่อ</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🧠 ผลวิเคราะห์เงินเดือนด้วย K-Means</Text>
          <Text style={styles.subtitle}>
            จัดกลุ่มเงินเดือนพนักงานออกเป็น 3 ระดับ (Tier 1, Tier 2, Tier 3)
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.jsonToggleBtn, showJsonView && styles.jsonToggleBtnActive]}
            onPress={() => setShowJsonView(!showJsonView)}
          >
            <Text
              style={[
                styles.jsonToggleBtnText,
                showJsonView && styles.jsonToggleBtnTextActive
              ]}
            >
              {showJsonView ? "📊 ซ่อน JSON View" : "📄 แสดง JSON View (JSON Format)"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
            <Text style={styles.refreshBtnText}>🔄 คำนวณใหม่</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* JSON Viewer Section (ตอบโจทย์ "โดยต้องใช้Jasonด้วย") */}
      {showJsonView ? (
        <View style={styles.jsonCard}>
          <View style={styles.jsonCardHeader}>
            <Text style={styles.jsonCardTitle}>📄 Raw JSON Data (Response จาก Express Backend)</Text>
            <Text style={styles.jsonBadge}>application/json</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <Text style={styles.jsonText}>{JSON.stringify(analysisData, null, 2)}</Text>
          </ScrollView>
        </View>
      ) : null}

      {/* Overall Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>พนักงานที่วิเคราะห์</Text>
          <Text style={styles.statValue}>{overall.totalEmployees || 0} คน</Text>
          <Text style={styles.statSub}>k = 3 Clusters</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>เงินเดือนเฉลี่ยรวม</Text>
          <Text style={[styles.statValue, { color: "#2563EB" }]}>
            ฿{(overall.overallAverageSalary || 0).toLocaleString()}
          </Text>
          <Text style={styles.statSub}>ต่อคน / เดือน</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>เงินเดือนต่ำสุด - สูงสุด</Text>
          <Text style={[styles.statValue, { fontSize: 16 }]}>
            ฿{(overall.minSalary || 0).toLocaleString()} - ฿
            {(overall.maxSalary || 0).toLocaleString()}
          </Text>
          <Text style={styles.statSub}>ช่วงเงินเดือนในองค์กร</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>งบประมาณเงินเดือนรวม</Text>
          <Text style={[styles.statValue, { color: "#059669" }]}>
            ฿{(overall.totalPayroll || 0).toLocaleString()}
          </Text>
          <Text style={styles.statSub}>Total Payroll</Text>
        </View>
      </View>

      {/* Visual Comparison Bar Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>📊 เปรียบเทียบเงินเดือนเฉลี่ยแต่ละกลุ่ม (Average Salary Comparison)</Text>
        <View style={styles.barsContainer}>
          {tiers.map((tier) => {
            const barWidthPercent = Math.max(
              Math.round((tier.averageSalary / maxAvgSalary) * 100),
              15
            );
            return (
              <View key={tier.tierKey} style={styles.barRow}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barLabelName}>{tier.tierName}</Text>
                  <Text style={styles.barLabelCount}>({tier.count} คน)</Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${barWidthPercent}%`,
                        backgroundColor: tier.color || "#3B82F6"
                      }
                    ]}
                  >
                    <Text style={styles.barFillText}>
                      ฿{tier.averageSalary.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Tier Details: Tier 1, Tier 2, Tier 3 */}
      <Text style={styles.sectionHeader}>📋 รายละเอียดของแต่ละกลุ่ม (Tier Details)</Text>

      {tiers.map((tier) => (
        <View key={tier.tierKey} style={[styles.tierCard, { borderLeftColor: tier.color }]}>
          {/* Tier Header */}
          <View style={styles.tierHeader}>
            <View>
              <View style={styles.tierTitleBadgeRow}>
                <Text style={styles.tierTitle}>{tier.tierName}</Text>
                <View style={[styles.badge, { backgroundColor: tier.color + "20" }]}>
                  <Text style={[styles.badgeText, { color: tier.color }]}>
                    สัดส่วน {tier.percentage}
                  </Text>
                </View>
              </View>
              <Text style={styles.tierDesc}>{tier.description}</Text>
            </View>

            <View style={styles.tierCountBox}>
              <Text style={styles.tierCountNumber}>{tier.count}</Text>
              <Text style={styles.tierCountText}>คน</Text>
            </View>
          </View>

          {/* Tier Metrics */}
          <View style={styles.tierMetricsGrid}>
            <View style={styles.tierMetricItem}>
              <Text style={styles.tierMetricLabel}>เงินเดือนเฉลี่ย (Average)</Text>
              <Text style={[styles.tierMetricValue, { color: tier.color }]}>
                ฿{tier.averageSalary.toLocaleString()}
              </Text>
            </View>

            <View style={styles.tierMetricItem}>
              <Text style={styles.tierMetricLabel}>จำนวนพนักงาน (Count)</Text>
              <Text style={styles.tierMetricValue}>{tier.count} คน</Text>
            </View>

            <View style={styles.tierMetricItem}>
              <Text style={styles.tierMetricLabel}>ช่วงเงินเดือน (Min - Max)</Text>
              <Text style={styles.tierMetricValue}>
                ฿{tier.minSalary.toLocaleString()} - ฿{tier.maxSalary.toLocaleString()}
              </Text>
            </View>

            <View style={styles.tierMetricItem}>
              <Text style={styles.tierMetricLabel}>ค่ากึ่งกลางกลุ่ม (Centroid)</Text>
              <Text style={styles.tierMetricValue}>฿{tier.centroid.toLocaleString()}</Text>
            </View>
          </View>

          {/* Member List */}
          <View style={styles.memberSection}>
            <Text style={styles.memberSectionTitle}>
              รายชื่อพนักงานในกลุ่มนี้ ({tier.employees ? tier.employees.length : 0} คน):
            </Text>
            <View style={styles.memberList}>
              {tier.employees && tier.employees.length > 0 ? (
                tier.employees.map((emp) => (
                  <View key={emp.id} style={styles.memberItem}>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{emp.name}</Text>
                      <Text style={styles.memberPosition}>
                        {emp.position} • {emp.department}
                      </Text>
                    </View>
                    <View style={styles.memberSalaryBadge}>
                      <Text style={styles.memberSalaryText}>
                        ฿{emp.salary.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noMemberText}>ไม่มีพนักงานในกลุ่มนี้</Text>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6"
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: "#6B7280"
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 8
  },
  backBtnText: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600"
  },
  headerTitleRow: {
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827"
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6
  },
  jsonToggleBtn: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  jsonToggleBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6"
  },
  jsonToggleBtnText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "600"
  },
  jsonToggleBtnTextActive: {
    color: "#2563EB"
  },
  refreshBtn: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  refreshBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600"
  },
  jsonCard: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16
  },
  jsonCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 8
  },
  jsonCardTitle: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 13
  },
  jsonBadge: {
    backgroundColor: "#334155",
    color: "#38BDF8",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontFamily: "monospace"
  },
  jsonText: {
    color: "#38BDF8",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500"
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4
  },
  statSub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2
  },
  chartSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 14
  },
  barsContainer: {
    gap: 12
  },
  barRow: {
    gap: 6
  },
  barLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  barLabelName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151"
  },
  barLabelCount: {
    fontSize: 12,
    color: "#6B7280"
  },
  barTrack: {
    height: 28,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 14
  },
  barFillText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12
  },
  tierCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  tierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14
  },
  tierTitleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  tierTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827"
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700"
  },
  tierDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2
  },
  tierCountBox: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  tierCountNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827"
  },
  tierCountText: {
    fontSize: 10,
    color: "#6B7280"
  },
  tierMetricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 12
  },
  tierMetricItem: {
    flex: 1,
    minWidth: 130
  },
  tierMetricLabel: {
    fontSize: 11,
    color: "#6B7280"
  },
  tierMetricValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2
  },
  memberSection: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12
  },
  memberSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8
  },
  memberList: {
    gap: 8
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6"
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827"
  },
  memberPosition: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1
  },
  memberSalaryBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  memberSalaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981"
  },
  noMemberText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic"
  }
});

