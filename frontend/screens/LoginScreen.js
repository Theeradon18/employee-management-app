import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { apiService } from "../services/api";

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage("กรุณากรอก Username และ Password ให้ครบถ้วน");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await apiService.login(username.trim(), password);
      if (result.success) {
        onLoginSuccess(result.user, result.token);
      } else {
        setErrorMessage(result.message || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      setErrorMessage("ไม่สามารถเชื่อมต่อ Backend ได้ (ตรวจสอบว่าเปิด Express Server พอร์ต 5000 แล้ว)");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAdmin = () => {
    setUsername("admin");
    setPassword("admin123");
    setErrorMessage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {/* Brand & Title */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>👥</Text>
            </View>
            <Text style={styles.title}>ระบบจัดการข้อมูลพนักงาน</Text>
            <Text style={styles.subtitle}>Employee Management & K-Means Salary Analysis</Text>
          </View>

          {/* Info Badge */}
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeTitle}>🔑 ข้อมูลเข้าสู่ระบบ (Admin Access)</Text>
            <Text style={styles.infoBadgeText}>Username: <Text style={styles.bold}>admin</Text></Text>
            <Text style={styles.infoBadgeText}>Password: <Text style={styles.bold}>admin123</Text> (หรือ admin)</Text>
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ชื่อผู้ใช้งาน (Username)</Text>
            <TextInput
              style={styles.input}
              placeholder="ระบุชื่อผู้ใช้ เช่น admin"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrorMessage("");
              }}
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.inputLabel}>รหัสผ่าน (Password)</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePasswordText}>
                  {showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="ระบุรหัสผ่าน"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage("");
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Quick Fill Button */}
          <TouchableOpacity style={styles.quickFillBtn} onPress={fillQuickAdmin}>
            <Text style={styles.quickFillText}>⚡ กรอกข้อมูล Admin อัตโนมัติ</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.loginBtnText}>เข้าสู่ระบบ (Login)</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6"
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    maxWidth: 440,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8
  },
  header: {
    alignItems: "center",
    marginBottom: 20
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#BFDBFE"
  },
  iconText: {
    fontSize: 32
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center"
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center"
  },
  infoBadge: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16
  },
  infoBadgeTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 4
  },
  infoBadgeText: {
    fontSize: 12,
    color: "#15803D"
  },
  bold: {
    fontWeight: "700"
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 14
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "500"
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  togglePasswordText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "500"
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827"
  },
  quickFillBtn: {
    alignSelf: "flex-end",
    marginBottom: 16
  },
  quickFillText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600"
  },
  loginBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  loginBtnDisabled: {
    opacity: 0.7
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  }
});

