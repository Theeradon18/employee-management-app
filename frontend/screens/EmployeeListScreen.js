import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl
} from "react-native";
import { apiService } from "../services/api";
import EmployeeModal from "../components/EmployeeModal";
import EmployeeDetailModal from "../components/EmployeeDetailModal";

export default function EmployeeListScreen({ onNavigateToAnalysis }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await apiService.getEmployees(search, statusFilter);
      if (res.success) {
        setEmployees(res.data);
      }
    } catch (err) {
      console.error("Fetch employees error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, statusFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmployees();
  };

  // 1. เพิ่มพนักงาน (Create) หรือ แก้ไขพนักงาน (Update)
  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        // Update
        const res = await apiService.updateEmployee(editingEmployee.id, employeeData);
        if (res.success) {
          setModalVisible(false);
          setEditingEmployee(null);
          fetchEmployees();
        } else {
          Alert.alert("ผิดพลาด", res.message || "ไม่สามารถอัปเดตข้อมูลได้");
        }
      } else {
        // Create
        const res = await apiService.addEmployee(employeeData);
        if (res.success) {
          setModalVisible(false);
          fetchEmployees();
        } else {
          Alert.alert("ผิดพลาด", res.message || "ไม่สามารถเพิ่มข้อมูลได้");
        }
      }
    } catch (err) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  // 2. เปลี่ยนสถานะพนักงาน (Toggle Active / Inactive)
  const handleToggleStatus = async (employee) => {
    const nextStatus = employee.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await apiService.toggleEmployeeStatus(employee.id, nextStatus);
      if (res.success) {
        setEmployees((prev) =>
          prev.map((e) => (e.id === employee.id ? { ...e, status: nextStatus } : e))
        );
      }
    } catch (err) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  // 3. ลบพนักงาน (Delete)
  const handleDeleteEmployee = (employee) => {
    const doDelete = async () => {
      try {
        const res = await apiService.deleteEmployee(employee.id);
        if (res.success) {
          setEmployees((prev) => prev.filter((e) => e.id !== employee.id));
        } else {
          Alert.alert("ผิดพลาด", res.message || "ไม่สามารถลบข้อมูลได้");
        }
      } catch (err) {
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบพนักงาน "${employee.name}"?`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        "ยืนยันการลบ",
        `คุณต้องการลบพนักงาน "${employee.name}" ใช่หรือไม่?`,
        [
          { text: "ยกเลิก", style: "cancel" },
          { text: "ลบ", style: "destructive", onPress: doDelete }
        ]
      );
    }
  };

  // รีเซ็ตข้อมูลกลับเป็นตัวอย่างเริ่มต้น 7 คน
  const handleResetData = async () => {
    try {
      const res = await apiService.resetEmployees();
      if (res.success) {
        setEmployees(res.data);
        Alert.alert("สำเร็จ", "รีเซ็ตข้อมูลเริ่มต้น 7 คนเรียบร้อยแล้ว");
      }
    } catch (err) {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถรีเซ็ตข้อมูลได้");
    }
  };

  const renderEmployeeCard = ({ item }) => {
    const isActive = item.status === "Active";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.empName}>{item.name}</Text>
            <Text style={styles.empPosition}>{item.position}</Text>
            <Text style={styles.empDept}>📁 แผนก: {item.department}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isActive ? styles.statusBadgeActive : styles.statusBadgeInactive
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isActive ? styles.statusTextActive : styles.statusTextInactive
              ]}
            >
              {isActive ? "🟢 Active" : "🔴 Inactive"}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryLabel}>เงินเดือน:</Text>
            <Text style={styles.salaryValue}>
              ฿{item.salary ? item.salary.toLocaleString() : 0}{" "}
              <Text style={styles.salaryUnit}>บาท/เดือน</Text>
            </Text>
          </View>
          {item.email ? <Text style={styles.emailText}>✉️ {item.email}</Text> : null}
        </View>

        {/* Action Buttons: ดูข้อมูล, เปลี่ยนสถานะ, แก้ไข, ลบ */}
        <View style={styles.cardActions}>
          {/* ดูข้อมูลฉบับเต็ม */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnView]}
            onPress={() => {
              setViewingEmployee(item);
              setDetailModalVisible(true);
            }}
          >
            <Text style={[styles.actionBtnText, styles.btnViewText]}>🔍 รายละเอียด</Text>
          </TouchableOpacity>

          {/* เปลี่ยนสถานะ */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              isActive ? styles.btnInactive : styles.btnActive
            ]}
            onPress={() => handleToggleStatus(item)}
          >
            <Text
              style={[
                styles.actionBtnText,
                isActive ? styles.btnInactiveText : styles.btnActiveText
              ]}
            >
              {isActive ? "⏸️ พักงาน" : "▶️ เปิดใช้งาน"}
            </Text>
          </TouchableOpacity>

          {/* แก้ไขข้อมูล */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnEdit]}
            onPress={() => {
              setEditingEmployee(item);
              setModalVisible(true);
            }}
          >
            <Text style={[styles.actionBtnText, styles.btnEditText]}>✏️ แก้ไข</Text>
          </TouchableOpacity>

          {/* ลบ */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnDelete]}
            onPress={() => handleDeleteEmployee(item)}
          >
            <Text style={[styles.actionBtnText, styles.btnDeleteText]}>🗑️ ลบ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Add and Analysis Shortcut */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.screenTitle}>จัดการข้อมูลพนักงาน (CRUD)</Text>
          <Text style={styles.screenSubtitle}>
            พบพนักงานทั้งหมด {employees.length} คน (ข้อมูลใน In-Memory Backend)
          </Text>
        </View>

        <View style={styles.topButtons}>
          <TouchableOpacity
            style={styles.btnAnalysisShortcut}
            onPress={onNavigateToAnalysis}
          >
            <Text style={styles.btnAnalysisShortcutText}>📊 วิเคราะห์ K-Means</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => {
              setEditingEmployee(null);
              setModalVisible(true);
            }}
          >
            <Text style={styles.btnAddText}>➕ เพิ่มพนักงาน</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filter Controls */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาชื่อ, ตำแหน่ง หรือแผนก..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")} style={styles.clearSearchBtn}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>กรองสถานะ:</Text>
          {["All", "Active", "Inactive"].map((st) => (
            <TouchableOpacity
              key={st}
              style={[
                styles.filterChip,
                statusFilter === st && styles.filterChipActive
              ]}
              onPress={() => setStatusFilter(st)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === st && styles.filterChipTextActive
                ]}
              >
                {st === "All" ? "ทั้งหมด" : st === "Active" ? "Active 🟢" : "Inactive 🔴"}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.resetBtn} onPress={handleResetData}>
            <Text style={styles.resetBtnText}>🔄 รีเซ็ตตัวอย่าง 7 คน</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Employee List */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>กำลังโหลดข้อมูลพนักงาน...</Text>
        </View>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderEmployeeCard}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>ไม่พบข้อมูลพนักงาน</Text>
              <Text style={styles.emptySubtitle}>ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "เพิ่มพนักงานใหม่"</Text>
            </View>
          }
        />
      )}

      {/* Add / Edit Modal */}
      <EmployeeModal
        visible={modalVisible}
        employee={editingEmployee}
        onClose={() => {
          setModalVisible(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
      />

      {/* Employee Details Modal */}
      <EmployeeDetailModal
        visible={detailModalVisible}
        employee={viewingEmployee}
        onClose={() => {
          setDetailModalVisible(false);
          setViewingEmployee(null);
        }}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setModalVisible(true);
        }}
        onToggleStatus={async (emp) => {
          await handleToggleStatus(emp);
          setViewingEmployee((prev) =>
            prev ? { ...prev, status: prev.status === "Active" ? "Inactive" : "Active" } : null
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6"
  },
  topBar: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827"
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2
  },
  topButtons: {
    flexDirection: "row",
    gap: 10
  },
  btnAnalysisShortcut: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  btnAnalysisShortcutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14
  },
  btnAdd: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  btnAddText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14
  },
  filterSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB"
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827"
  },
  clearSearchBtn: {
    padding: 6
  },
  clearSearchText: {
    color: "#9CA3AF",
    fontSize: 14
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563"
  },
  filterChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  filterChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6"
  },
  filterChipText: {
    fontSize: 12,
    color: "#4B5563"
  },
  filterChipTextActive: {
    color: "#2563EB",
    fontWeight: "700"
  },
  resetBtn: {
    marginLeft: "auto",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCD34D"
  },
  resetBtnText: {
    fontSize: 12,
    color: "#B45309",
    fontWeight: "600"
  },
  listContent: {
    padding: 16,
    gap: 12
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6"
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#C7D2FE"
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4F46E5"
  },
  cardHeaderInfo: {
    flex: 1
  },
  empName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827"
  },
  empPosition: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 1
  },
  empDept: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12
  },
  statusBadgeActive: {
    backgroundColor: "#ECFDF5"
  },
  statusBadgeInactive: {
    backgroundColor: "#FEF2F2"
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700"
  },
  statusTextActive: {
    color: "#059669"
  },
  statusTextInactive: {
    color: "#DC2626"
  },
  cardBody: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  salaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  salaryLabel: {
    fontSize: 13,
    color: "#4B5563"
  },
  salaryValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#10B981"
  },
  salaryUnit: {
    fontSize: 11,
    fontWeight: "400",
    color: "#6B7280"
  },
  emailText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1
  },
  btnView: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB"
  },
  btnViewText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "600"
  },
  btnInactive: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A"
  },
  btnInactiveText: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "600"
  },
  btnActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0"
  },
  btnActiveText: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "600"
  },
  btnEdit: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE"
  },
  btnEditText: {
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "600"
  },
  btnDelete: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA"
  },
  btnDeleteText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600"
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280"
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center"
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151"
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center"
  }
});

