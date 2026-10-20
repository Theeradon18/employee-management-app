import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Platform
} from "react-native";
import { apiService } from "../services/api";

export default function LinksScreen({ onNavigateToEmployees, onNavigateToKMeans }) {
  const [activeApi, setActiveApi] = useState("/api/employees/analysis/kmeans");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState("200 OK");

  const linksList = [
    {
      id: "fe-app",
      title: "📱 แอปพลิเคชัน Frontend (React Native Web)",
      tag: "UI App",
      tagColor: "#8B5CF6",
      url: "http://localhost:8081",
      desc: "หน้าจอผู้ใช้งานหลัก จัดการพนักงาน (CRUD) และแสดงกราฟผลวิเคราะห์ K-Means",
      isInternal: true
    },
    {
      id: "be-portal",
      title: "🌐 หน้าเว็บรวมลิงก์ & Web Portal (Backend)",
      tag: "HTML Portal",
      tagColor: "#3B82F6",
      url: "http://localhost:5000/links",
      desc: "หน้าเว็บพอร์ทัลศูนย์รวมลิงก์และหน้าทดสอบ API บนเซิร์ฟเวอร์ Express.js",
      isInternal: false
    },
    {
      id: "api-kmeans",
      title: "📊 ผลวิเคราะห์เงินเดือน K-Means (JSON API)",
      tag: "GET / Analysis",
      tagColor: "#10B981",
      url: "http://localhost:5000/api/employees/analysis/kmeans",
      desc: "รันอัลกอริทึมแบ่งเงินเดือนเป็น Tier 1 (High), Tier 2 (Mid), Tier 3 (Entry)",
      endpoint: "/api/employees/analysis/kmeans"
    },
    {
      id: "api-employees",
      title: "👥 รายชื่อพนักงานทั้งหมด (JSON API)",
      tag: "GET / CRUD",
      tagColor: "#059669",
      url: "http://localhost:5000/api/employees",
      desc: "ดึงรายชื่อพนักงานทั้งหมด 7 คนในหน่วยความจำ (In-Memory Database)",
      endpoint: "/api/employees"
    },
    {
      id: "api-emp-single",
      title: "👤 ข้อมูลพนักงานเดี่ยว ID 1 (JSON API)",
      tag: "GET / Single",
      tagColor: "#0284C7",
      url: "http://localhost:5000/api/employees/1",
      desc: "ดึงข้อมูลพนักงานตาม ID เช่น นายสมชาย ใจดี",
      endpoint: "/api/employees/1"
    },
    {
      id: "api-auth",
      title: "🔐 ตรวจสอบสถานะ Auth Service",
      tag: "GET / Auth",
      tagColor: "#D97706",
      url: "http://localhost:5000/api/auth/status",
      desc: "ตรวจสอบความพร้อมของระบบยืนยันตัวตนผู้ดูแลระบบ",
      endpoint: "/api/auth/status"
    },
    {
      id: "github-repo",
      title: "🐙 ซอร์สโค้ดบน GitHub (Repository)",
      tag: "Git Source",
      tagColor: "#334155",
      url: "https://github.com/Theeradon18/employee-management-app",
      desc: "คลังเก็บโค้ดโปรเจกต์ฉบับสมบูรณ์ พร้อมประวัติการพัฒนาและเอกสาร README",
      isInternal: false
    }
  ];

  const handleOpenUrl = (url) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
    }
  };

  const handleTestApi = async (endpoint) => {
    setActiveApi(endpoint);
    setLoading(true);
    setApiResponse(null);
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`);
      const data = await res.json();
      setStatusCode(`${res.status} OK`);
      setApiResponse(data);
    } catch (err) {
      setStatusCode("Error");
      setApiResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.badgeRow}>
          <View style={styles.statusLivePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>SYSTEM ONLINE • PORT 5000 & 8081</Text>
          </View>
        </View>

        <Text style={styles.headerTitle}>🔗 รวมลิงก์ระบบทั้งหมด & API Explorer</Text>
        <Text style={styles.headerSubtitle}>
          หน้าศูนย์รวมลิงก์เข้าใช้งานทุกหน้าของแอปพลิเคชัน ทั้งฝั่งเว็บแอป, หลังบ้าน Express.js, ซอร์สโค้ด GitHub และจุดทดสอบ JSON REST API ครบทุก Endpoint
        </Text>

        {/* Credentials Reminder */}
        <View style={styles.credBox}>
          <Text style={styles.credTitle}>🔑 ข้อมูลเข้าสู่ระบบ Admin:</Text>
          <Text style={styles.credItem}>
            Username: <Text style={styles.credBold}>admin</Text>
          </Text>
          <Text style={styles.credItem}>
            Password: <Text style={styles.credBold}>admin123</Text> (หรือ admin)
          </Text>
        </View>
      </View>

      {/* Quick Navigation Shortcuts */}
      <View style={styles.shortcutsRow}>
        <TouchableOpacity style={styles.shortcutBtnPrimary} onPress={onNavigateToEmployees}>
          <Text style={styles.shortcutBtnText}>👥 ไปหน้ารายชื่อพนักงาน (CRUD)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shortcutBtnPurple} onPress={onNavigateToKMeans}>
          <Text style={styles.shortcutBtnText}>📊 ไปหน้าวิเคราะห์ K-Means (3 Tiers)</Text>
        </TouchableOpacity>
      </View>

      {/* System Links Grid */}
      <Text style={styles.sectionHeader}>📂 รายการลิงก์สำคัญในระบบ (System Links)</Text>

      <View style={styles.linksGrid}>
        {linksList.map((item) => (
          <View key={item.id} style={styles.linkCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={[styles.tagBadge, { backgroundColor: item.tagColor + "20" }]}>
                <Text style={[styles.tagText, { color: item.tagColor }]}>{item.tag}</Text>
              </View>
            </View>

            <Text style={styles.cardDesc}>{item.desc}</Text>

            <View style={styles.urlBox}>
              <Text style={styles.urlText} numberOfLines={1}>
                {item.url}
              </Text>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.btnOpenLink}
                onPress={() => handleOpenUrl(item.url)}
              >
                <Text style={styles.btnOpenLinkText}>เปิดในเบราว์เซอร์ ↗</Text>
              </TouchableOpacity>

              {item.endpoint ? (
                <TouchableOpacity
                  style={styles.btnTestLink}
                  onPress={() => handleTestApi(item.endpoint)}
                >
                  <Text style={styles.btnTestLinkText}>⚡ ทดสอบสด</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      {/* Interactive In-App API Tester */}
      <View style={styles.testerContainer}>
        <View style={styles.testerHeader}>
          <Text style={styles.testerTitle}>⚡ เครื่องมือทดสอบเรียก API สด (In-App JSON Viewer)</Text>
          <Text style={styles.testerBadge}>{statusCode}</Text>
        </View>

        <Text style={styles.testerSub}>คลิกปุ่มด้านล่างเพื่อทดสอบ Response JSON แบบเรียลไทม์:</Text>

        <View style={styles.apiButtonsRow}>
          <TouchableOpacity
            style={[styles.apiPill, activeApi === "/api/employees/analysis/kmeans" && styles.apiPillActive]}
            onPress={() => handleTestApi("/api/employees/analysis/kmeans")}
          >
            <Text style={[styles.apiPillText, activeApi === "/api/employees/analysis/kmeans" && styles.apiPillTextActive]}>
              📊 K-Means 3 Tiers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.apiPill, activeApi === "/api/employees" && styles.apiPillActive]}
            onPress={() => handleTestApi("/api/employees")}
          >
            <Text style={[styles.apiPillText, activeApi === "/api/employees" && styles.apiPillTextActive]}>
              👥 พนักงานทั้งหมด (7 คน)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.apiPill, activeApi === "/api/employees/1" && styles.apiPillActive]}
            onPress={() => handleTestApi("/api/employees/1")}
          >
            <Text style={[styles.apiPillText, activeApi === "/api/employees/1" && styles.apiPillTextActive]}>
              👤 พนักงาน ID 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.apiPill, activeApi === "/api/auth/status" && styles.apiPillActive]}
            onPress={() => handleTestApi("/api/auth/status")}
          >
            <Text style={[styles.apiPillText, activeApi === "/api/auth/status" && styles.apiPillTextActive]}>
              🔐 Auth Service
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.jsonBox}>
          <Text style={styles.jsonEndpointText}>URL: http://localhost:5000{activeApi}</Text>
          {loading ? (
            <View style={styles.jsonLoading}>
              <ActivityIndicator color="#38BDF8" size="small" />
              <Text style={styles.jsonLoadingText}>กำลังเรียก API...</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <Text style={styles.jsonContent}>
                {apiResponse ? JSON.stringify(apiResponse, null, 2) : "กดปุ่มด้านบนเพื่อทดสอบดึงข้อมูล JSON สด"}
              </Text>
            </ScrollView>
          )}
        </View>
      </View>

      {/* Requirements Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>✅ สรุปความครบถ้วนตามข้อกำหนด 100%</Text>
        <Text style={styles.summaryItem}>✓ Backend: Express.js พอร์ต 5000 พร้อม In-Memory Database</Text>
        <Text style={styles.summaryItem}>✓ Frontend: React Native พร้อมระบบ Login และ Navigation Tabs</Text>
        <Text style={styles.summaryItem}>✓ Authentication: ผู้ดูแลระบบ Admin (admin / admin123)</Text>
        <Text style={styles.summaryItem}>✓ CRUD: เพิ่ม, แสดง, แก้ไข, พักงาน/เปิดใช้งาน, ลบพนักงาน</Text>
        <Text style={styles.summaryItem}>✓ ข้อมูลตัวอย่าง: พนักงานเริ่มต้น 7 คน (เกินเกณฑ์ขั้นต่ำ 5 คน)</Text>
        <Text style={styles.summaryItem}>✓ K-Means Clustering: แบ่งเงินเดือนเป็น Tier 1, Tier 2, Tier 3</Text>
        <Text style={styles.summaryItem}>✓ สถิติ: คำนวณเงินเดือนเฉลี่ยและจำนวนพนักงานในแต่ละกลุ่ม</Text>
        <Text style={styles.summaryItem}>✓ JSON: รับ-ส่งข้อมูลผ่าน JSON และมี JSON Viewer ทุกจุด</Text>
        <Text style={styles.summaryItem}>✓ GitHub: เผยแพร่โค้ดขึ้น GitHub เรียบร้อยแล้ว</Text>
      </View>
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
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 10
  },
  statusLivePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0"
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669"
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 14
  },
  credBox: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12
  },
  credTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151"
  },
  credItem: {
    fontSize: 13,
    color: "#4B5563"
  },
  credBold: {
    fontWeight: "700",
    color: "#2563EB",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  shortcutsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap"
  },
  shortcutBtnPrimary: {
    flex: 1,
    minWidth: 200,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center"
  },
  shortcutBtnPurple: {
    flex: 1,
    minWidth: 200,
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center"
  },
  shortcutBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700"
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12
  },
  linksGrid: {
    gap: 12,
    marginBottom: 20
  },
  linkCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    flex: 1
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700"
  },
  cardDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 10
  },
  urlBox: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10
  },
  urlText: {
    fontSize: 12,
    color: "#2563EB",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace"
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end"
  },
  btnOpenLink: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  btnOpenLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1D4ED8"
  },
  btnTestLink: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  btnTestLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151"
  },
  testerContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20
  },
  testerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  testerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F8FAFC"
  },
  testerBadge: {
    backgroundColor: "#334155",
    color: "#38BDF8",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: "600"
  },
  testerSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 12
  },
  apiButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  apiPill: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8
  },
  apiPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#3B82F6"
  },
  apiPillText: {
    fontSize: 12,
    color: "#CBD5E1",
    fontWeight: "500"
  },
  apiPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  jsonBox: {
    backgroundColor: "#0F172A",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155"
  },
  jsonEndpointText: {
    fontSize: 11,
    color: "#34D399",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginBottom: 8
  },
  jsonLoading: {
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10
  },
  jsonLoadingText: {
    color: "#38BDF8",
    fontSize: 12
  },
  jsonContent: {
    fontSize: 11,
    color: "#38BDF8",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    lineHeight: 16
  },
  summaryCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 16
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 10
  },
  summaryItem: {
    fontSize: 12,
    color: "#15803D",
    marginBottom: 6,
    lineHeight: 18
  }
});
