import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform
} from "react-native";

export default function EmployeeDetailModal({
  visible,
  employee,
  onClose,
  onEdit,
  onToggleStatus
}) {
  if (!employee) return null;

  const isActive = employee.status === "Active";

  // ประเมินกลุ่ม Tier เบื้องต้นจากระดับเงินเดือน
  let tierEstimate = "Tier 2 (Mid)";
  let tierColor = "#3B82F6";
  if (employee.salary >= 70000) {
    tierEstimate = "Tier 1 (High Salary)";
    tierColor = "#10B981";
  } else if (employee.salary < 35000) {
    tierEstimate = "Tier 3 (Entry Salary)";
    tierColor = "#F59E0B";
  }

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Modal Header */}
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
              </View>
              <View style={styles.headerTitleCol}>
                <Text style={styles.empName}>{employee.name}</Text>
                <Text style={styles.empPos}>{employee.position}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Badges Row */}
            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.badge,
                  isActive ? styles.badgeActive : styles.badgeInactive
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isActive ? styles.badgeTextActive : styles.badgeTextInactive
                  ]}
                >
                  {isActive ? "🟢 ปฏิบัติงาน (Active)" : "🔴 พักงาน (Inactive)"}
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: tierColor + "20" }]}>
                <Text style={[styles.badgeText, { color: tierColor }]}>
                  {tierEstimate}
                </Text>
              </View>
            </View>

            {/* Detail Fields */}
            <View style={styles.detailSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>รหัสพนักงาน (ID):</Text>
                <Text style={styles.detailValue}>#{employee.id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>แผนก (Department):</Text>
                <Text style={styles.detailValue}>📁 {employee.department || "General"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>เงินเดือน (Salary):</Text>
                <Text style={[styles.detailValue, styles.salaryHighlight]}>
                  ฿{(employee.salary || 0).toLocaleString()} บาท/เดือน
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>อีเมล (Email):</Text>
                <Text style={styles.detailValue}>✉️ {employee.email || "-"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>วันที่บันทึก (Created):</Text>
                <Text style={styles.detailValue}>
                  {employee.createdAt
                    ? new Date(employee.createdAt).toLocaleString("th-TH")
                    : "-"}
                </Text>
              </View>
            </View>

            {/* JSON Viewer */}
            <View style={styles.jsonSection}>
              <View style={styles.jsonHeader}>
                <Text style={styles.jsonTitle}>📄 ข้อมูลดิบแบบ JSON (JSON Object)</Text>
                <Text style={styles.jsonMime}>application/json</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <Text style={styles.jsonText}>{JSON.stringify(employee, null, 2)}</Text>
              </ScrollView>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.btnAction,
                  isActive ? styles.btnInactive : styles.btnActive
                ]}
                onPress={() => onToggleStatus(employee)}
              >
                <Text
                  style={[
                    styles.btnActionText,
                    isActive ? styles.btnInactiveText : styles.btnActiveText
                  ]}
                >
                  {isActive ? "⏸️ เปลี่ยนเป็น Inactive" : "▶️ เปลี่ยนเป็น Active"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnAction, styles.btnEdit]}
                onPress={() => {
                  onClose();
                  onEdit(employee);
                }}
              >
                <Text style={[styles.btnActionText, styles.btnEditText]}>✏️ แก้ไขข้อมูล</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnClose} onPress={onClose}>
                <Text style={styles.btnCloseText}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#C7D2FE"
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4F46E5"
  },
  headerTitleCol: {
    flex: 1
  },
  empName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827"
  },
  empPos: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  },
  closeBtnText: {
    fontSize: 18,
    color: "#9CA3AF",
    fontWeight: "600"
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  badgeActive: {
    backgroundColor: "#ECFDF5"
  },
  badgeInactive: {
    backgroundColor: "#FEF2F2"
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700"
  },
  badgeTextActive: {
    color: "#059669"
  },
  badgeTextInactive: {
    color: "#DC2626"
  },
  detailSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280"
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937"
  },
  salaryHighlight: {
    fontSize: 15,
    fontWeight: "800",
    color: "#10B981"
  },
  jsonSection: {
    backgroundColor: "#1E293B",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16
  },
  jsonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 6
  },
  jsonTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F8FAFC"
  },
  jsonMime: {
    fontSize: 10,
    color: "#38BDF8",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace"
  },
  jsonText: {
    fontSize: 11,
    color: "#38BDF8",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    lineHeight: 16
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end"
  },
  btnAction: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1
  },
  btnActive: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0"
  },
  btnActiveText: {
    color: "#059669",
    fontWeight: "600",
    fontSize: 12
  },
  btnInactive: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A"
  },
  btnInactiveText: {
    color: "#B45309",
    fontWeight: "600",
    fontSize: 12
  },
  btnEdit: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE"
  },
  btnEditText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 12
  },
  btnClose: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  btnCloseText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 12
  }
});
