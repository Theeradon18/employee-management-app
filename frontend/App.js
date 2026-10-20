import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from "react-native";
import LoginScreen from "./screens/LoginScreen";
import EmployeeListScreen from "./screens/EmployeeListScreen";
import KMeansAnalysisScreen from "./screens/KMeansAnalysisScreen";
import LinksScreen from "./screens/LinksScreen";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [currentTab, setCurrentTab] = useState("employees"); // 'employees' | 'kmeans' | 'links'

  // เมื่อเข้าสู่ระบบสำเร็จ
  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setCurrentTab("employees");
  };

  // ออกจากระบบ
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setCurrentTab("employees");
  };

  // หากยังไม่เข้าสู่ระบบ ให้แสดงหน้า Login
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
  }

  // หากเข้าสู่ระบบแล้ว แสดง Navbar และเนื้อหาของแต่ละ Tab
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main App Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navBrand}>
          <Text style={styles.navBrandIcon}>🏢</Text>
          <View>
            <Text style={styles.navBrandTitle}>ระบบบริหารงานบุคคล & วิเคราะห์เงินเดือน</Text>
            <Text style={styles.navBrandSubtitle}>
              เข้าสู่ระบบโดย: <Text style={styles.navAdminName}>{currentUser.name}</Text> ({currentUser.role})
            </Text>
          </View>
        </View>

        {/* Tab Switcher & Logout */}
        <View style={styles.navActions}>
          <View style={styles.tabButtonsGroup}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                currentTab === "employees" && styles.tabBtnActive
              ]}
              onPress={() => setCurrentTab("employees")}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  currentTab === "employees" && styles.tabBtnTextActive
                ]}
              >
                👥 จัดการพนักงาน (CRUD)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                currentTab === "kmeans" && styles.tabBtnActive
              ]}
              onPress={() => setCurrentTab("kmeans")}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  currentTab === "kmeans" && styles.tabBtnTextActive
                ]}
              >
                📊 วิเคราะห์ K-Means (3 Tiers)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                currentTab === "links" && styles.tabBtnActive
              ]}
              onPress={() => setCurrentTab("links")}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  currentTab === "links" && styles.tabBtnTextActive
                ]}
              >
                🔗 รวมลิงก์ & APIs
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>🚪 ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {currentTab === "employees" ? (
          <EmployeeListScreen onNavigateToAnalysis={() => setCurrentTab("kmeans")} />
        ) : currentTab === "kmeans" ? (
          <KMeansAnalysisScreen onBackToEmployees={() => setCurrentTab("employees")} />
        ) : (
          <LinksScreen
            onNavigateToEmployees={() => setCurrentTab("employees")}
            onNavigateToKMeans={() => setCurrentTab("kmeans")}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6"
  },
  navbar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12
  },
  navBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  navBrandIcon: {
    fontSize: 28
  },
  navBrandTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827"
  },
  navBrandSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2
  },
  navAdminName: {
    color: "#059669",
    fontWeight: "700"
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap"
  },
  tabButtonsGroup: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 4,
    gap: 4
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280"
  },
  tabBtnTextActive: {
    color: "#2563EB",
    fontWeight: "700"
  },
  logoutBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  logoutBtnText: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "600"
  },
  mainContent: {
    flex: 1
  }
});
