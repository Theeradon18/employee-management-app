import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";

export default function EmployeeModal({ visible, onClose, onSave, employee }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState("Active");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(employee && employee.id);

  useEffect(() => {
    if (employee) {
      setName(employee.name || "");
      setPosition(employee.position || "");
      setDepartment(employee.department || "");
      setSalary(employee.salary !== undefined ? String(employee.salary) : "");
      setStatus(employee.status || "Active");
      setEmail(employee.email || "");
      setError("");
    } else {
      setName("");
      setPosition("");
      setDepartment("");
      setSalary("");
      setStatus("Active");
      setEmail("");
      setError("");
    }
  }, [employee, visible]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("กรุณากรอกชื่อพนักงาน");
      return;
    }
    const numSalary = Number(salary);
    if (isNaN(numSalary) || numSalary < 0 || salary.trim() === "") {
      setError("กรุณากรอกเงินเดือนเป็นตัวเลขที่ถูกต้อง (>= 0)");
      return;
    }

    const payload = {
      name: name.trim(),
      position: position.trim() || "Staff",
      department: department.trim() || "General",
      salary: numSalary,
      status,
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, ".")}@company.com`
    };

    onSave(payload);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Modal Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {isEditing ? "✏️ แก้ไขข้อมูลพนักงาน" : "➕ เพิ่มพนักงานใหม่"}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            {/* Form Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>ชื่อ-นามสกุลพนักงาน *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                }}
                placeholder="เช่น สมชาย ใจดี (Somchai)"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>ตำแหน่งงาน (Position)</Text>
              <TextInput
                style={styles.input}
                value={position}
                onChangeText={setPosition}
                placeholder="เช่น Software Engineer"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>แผนก (Department)</Text>
              <TextInput
                style={styles.input}
                value={department}
                onChangeText={setDepartment}
                placeholder="เช่น Engineering / Management"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>เงินเดือน (บาท / THB) *</Text>
              <TextInput
                style={styles.input}
                value={salary}
                onChangeText={(text) => {
                  setSalary(text);
                  setError("");
                }}
                placeholder="เช่น 55000"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>อีเมล (Email)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="employee@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Status Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>สถานะพนักงาน (Status)</Text>
              <View style={styles.statusRow}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    status === "Active" && styles.statusOptionActive
                  ]}
                  onPress={() => setStatus("Active")}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === "Active" && styles.statusOptionTextActive
                    ]}
                  >
                    🟢 Active (ปฏิบัติงาน)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    status === "Inactive" && styles.statusOptionInactive
                  ]}
                  onPress={() => setStatus("Inactive")}
                >
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === "Inactive" && styles.statusOptionTextInactive
                    ]}
                  >
                    🔴 Inactive (พักงาน/ลาออก)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveBtnText}>
                  {isEditing ? "บันทึกการแก้ไข" : "บันทึกพนักงาน"}
                </Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 12
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937"
  },
  closeBtn: {
    padding: 6
  },
  closeBtnText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600"
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F87171"
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "500"
  },
  formGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827"
  },
  statusRow: {
    flexDirection: "row",
    gap: 10
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F9FAFB"
  },
  statusOptionActive: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5"
  },
  statusOptionInactive: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2"
  },
  statusOptionText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500"
  },
  statusOptionTextActive: {
    color: "#059669",
    fontWeight: "700"
  },
  statusOptionTextInactive: {
    color: "#DC2626",
    fontWeight: "700"
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB"
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF"
  },
  cancelBtnText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "600"
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#2563EB"
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600"
  }
});

