# Employee Management & K-Means Salary Analysis App
## ระบบบริหารจัดการข้อมูลพนักงาน (CRUD) และวิเคราะห์กลุ่มเงินเดือนด้วย K-Means (Tier 1, Tier 2, Tier 3)

ระบบ Full-Stack ครบวงจรที่พัฒนาด้วย **Express.js (Backend In-Memory)** และ **React Native (Frontend Web & Mobile)** พร้อมระบบยืนยันตัวตนสำหรับผู้ดูแลระบบ (Admin Login) และการประมวลผล Machine Learning ด้วยอัลกอริทึม **K-Means Clustering (1D)** จัดกลุ่มเงินเดือนพนักงานออกเป็น 3 ระดับ ผ่าน **JSON REST API** 100% พร้อมหน้าศูนย์รวมลิงก์ระบบและแดชบอร์ดทดสอบ API

---

## 🔗 ลิงก์สำคัญของระบบ (System Links)

| ระบบ | URL | รายละเอียด |
|---|---|---|
| 🐙 **GitHub Repository** | [https://github.com/Theeradon18/employee-management-app](https://github.com/Theeradon18/employee-management-app) | คลังซอร์สโค้ดหลักบน GitHub |
| 📱 **Frontend Web App** | [http://localhost:8081](http://localhost:8081) | หน้าจอแอปพลิเคชัน React Native บนเว็บ |
| 🌐 **Backend Web Portal** | [http://localhost:5000/links](http://localhost:5000/links) | หน้าพอร์ทัลศูนย์รวมลิงก์ & แดชบอร์ดทดสอบ API |
| 📊 **K-Means JSON API** | [http://localhost:5000/api/employees/analysis/kmeans](http://localhost:5000/api/employees/analysis/kmeans) | ผลวิเคราะห์ K-Means 3 Tiers แบบ JSON |
| 👥 **Employees JSON API** | [http://localhost:5000/api/employees](http://localhost:5000/api/employees) | รายชื่อพนักงานทั้งหมด 7 คน แบบ JSON |
| 🔗 **All Links JSON API** | [http://localhost:5000/api/links](http://localhost:5000/api/links) | สารบัญลิงก์และ Endpoint ทั้งหมดแบบ JSON |

---

## 🔑 ข้อมูลเข้าสู่ระบบ (Admin Login Credentials)

- **Username**: `admin`
- **Password**: `admin123` *(หรือใช้ `admin` ก็ได้ มีปุ่ม "⚡ กรอกข้อมูล Admin อัตโนมัติ" ในหน้าจอ)*

---

## 📂 โครงสร้างโปรเจกต์ (Project Structure)

```text
employee-management-app/
├── backend/
│   ├── data/
│   │   └── employeesData.js       # In-Memory Database จำลองพนักงานเริ่มต้น 7 คน (เกินเกณฑ์ 5 คน)
│   ├── routes/
│   │   ├── authRoutes.js          # API สำหรับ Login ตรวจสอบ admin / admin123
│   │   └── employeeRoutes.js      # API สำหรับ CRUD พนักงาน และ Endpoint วิเคราะห์ K-Means
│   ├── utils/
│   │   └── kmeans.js              # อัลกอริทึม K-Means 1D แบ่งเงินเดือนเป็น 3 Tiers (Centroid, Average, Count)
│   ├── portalHtml.js              # แม่แบบหน้าเว็บ HTML Links Portal & Interactive API Tester
│   ├── server.js                  # Express.js Server (Port 5000)
│   ├── test-api.js                # สคริปต์ Automated Test ทดสอบ CRUD และ K-Means 100% (21/21 ผ่าน)
│   └── package.json
│
├── frontend/
│   ├── components/
│   │   ├── EmployeeModal.js       # Modal เพิ่ม/แก้ไขข้อมูลพนักงาน (Form Validation)
│   │   └── EmployeeDetailModal.js # Modal แสดงรายละเอียดพนักงานฉบับเต็ม + Tier + JSON Viewer
│   ├── screens/
│   │   ├── LoginScreen.js         # หน้าจอล็อกอินสำหรับ Admin
│   │   ├── EmployeeListScreen.js  # หน้ารายการพนักงาน, ค้นหา, กรอง, สลับสถานะ, ลบ, แก้ไข, ดูรายละเอียด
│   │   ├── KMeansAnalysisScreen.js# หน้าแสดงผลวิเคราะห์ K-Means 3 Tiers, กราฟเปรียบเทียบ และ JSON Viewer
│   │   └── LinksScreen.js         # หน้าศูนย์รวมลิงก์ระบบ & เครื่องมือทดสอบเรียก API สด (In-App)
│   ├── services/
│   │   └── api.js                 # API Client เชื่อมต่อ Express Backend ผ่าน JSON
│   ├── App.js                     # Root Component จัดการ State Login และ Tab Navigation 3 แท็บ
│   ├── app.json                   # Expo App Configuration
│   └── package.json
│
├── .gitignore                     # กำหนดไฟล์ที่ไม่ต้อง push ขึ้น Git
└── README.md                      # เอกสารคู่มือแนะนำการใช้งานระบบฉบับสมบูรณ์
```

---

## 🛠️ วิธีการรันโปรเจกต์ (How to Run)

### 1. โคลนโปรเจกต์จาก GitHub
```bash
git clone https://github.com/Theeradon18/employee-management-app.git
cd employee-management-app
```

### 2. รัน Backend (Express.js)
เปิด Terminal ที่ 1:
```bash
cd backend
npm install
npm start
```
> เซิร์ฟเวอร์ Backend จะทำงานที่: **`http://localhost:5000`**  
> หน้าเว็บพอร์ทัลรวมลิงก์: **`http://localhost:5000/links`**

### 3. รัน Frontend (React Native / Expo)
เปิด Terminal ที่ 2:
```bash
cd frontend
npm install
npm run web
```
> แอปพลิเคชัน Frontend จะเปิดบนเว็บเบราว์เซอร์ที่: **`http://localhost:8081`**  
> หรือรัน `npx expo start` เพื่อสแกน QR Code ใช้งานผ่านโทรศัพท์มือถือด้วยแอป **Expo Go**

---

## 📊 การวิเคราะห์กลุ่มเงินเดือนด้วย K-Means (3 Tiers)

อัลกอริทึมคำนวณการจัดกลุ่มแบบ 1 มิติ (1D K-Means Clustering) โดยแบ่งเงินเดือนพนักงานออกเป็น 3 กลุ่ม ($k = 3$):
1. **Tier 1 (High Salary)**: เงินเดือนระดับสูง (เช่น ผู้บริหาร, Senior Engineer)
2. **Tier 2 (Mid Salary)**: เงินเดือนระดับกลาง (เช่น DevOps Engineer, Data Specialist)
3. **Tier 3 (Entry Salary)**: เงินเดือนระดับเริ่มต้น (เช่น Junior Developer, เจ้าหน้าที่ธุรการ)

### ข้อมูลที่ระบบประมวลผลและส่งกลับแบบ JSON:
- **`averageSalary`**: เงินเดือนเฉลี่ยของพนักงานในแต่ละ Tier
- **`count`**: จำนวนพนักงานที่อยู่ในกลุ่มนั้น
- **`percentage`**: สัดส่วนเปอร์เซ็นต์ของพนักงานในกลุ่มเทียบกับทั้งหมด
- **`minSalary` / `maxSalary`**: ช่วงเงินเดือนต่ำสุด - สูงสุดของแต่ละกลุ่ม
- **`centroid`**: ค่ากึ่งกลางของกลุ่มที่ลู่เข้าสู่จุดสมดุล (Convergence)
- **`employees`**: รายชื่อพนักงานและข้อมูลทั้งหมดที่จัดอยู่ในกลุ่มนั้น

---

## 📡 สรุป REST API Endpoints (JSON)

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/links` หรือ `/` | หน้าเว็บรวมลิงก์ทั้งหมดและเครื่องมือทดสอบ API (HTML Portal) |
| `GET` | `/api/links` | ดึงสารบัญลิงก์และ Endpoint ทั้งหมดในระบบ (JSON) |
| `POST` | `/api/auth/login` | เข้าสู่ระบบ Admin (รับ Body: `{ username, password }`) |
| `GET` | `/api/auth/status` | ตรวจสอบสถานะของ Authentication Service |
| `GET` | `/api/employees` | ดึงรายชื่อพนักงานทั้งหมด (รองรับ Query: `?search=` และ `?status=`) |
| `GET` | `/api/employees/:id` | ดึงข้อมูลพนักงานตามรหัส ID (JSON) |
| `POST` | `/api/employees` | เพิ่มพนักงานใหม่ (Create) |
| `PUT` | `/api/employees/:id` | แก้ไขข้อมูลพนักงานตาม ID (Update) |
| `PATCH` | `/api/employees/:id/status` | สลับหรือเปลี่ยนสถานะพนักงาน (Active / Inactive) |
| `DELETE` | `/api/employees/:id` | ลบข้อมูลพนักงานตาม ID (Delete) |
| `GET` | `/api/employees/analysis/kmeans` | รันโมเดล K-Means วิเคราะห์เงินเดือนแบ่ง 3 Tiers (JSON) |
| `POST` | `/api/employees/reset` | รีเซ็ตข้อมูลกลับเป็นตัวอย่างพนักงานเริ่มต้น 7 คน |

---

## 🧪 การทดสอบระบบ (Automated Tests)

สามารถรันสคริปต์ Automated Test ได้ด้วยคำสั่ง:
```bash
cd backend
node test-api.js
```
ผลลัพธ์: ผ่านการทดสอบทั้งหมด **21/21 รายการ (100% Pass)**

---

## ✅ ตารางตรวจสอบข้อกำหนดโจทย์ (Requirements Checklist)

| ข้อกำหนด | สถานะ | รายละเอียดที่พัฒนา |
|---|---|---|
| 1. Backend ด้วย Express.js | ✅ เสร็จสมบูรณ์ | Express Server พอร์ต 5000 พร้อมสถาปัตยกรรม Routes/Controllers |
| 2. Frontend ด้วย React Native | ✅ เสร็จสมบูรณ์ | พัฒนาด้วย React Native/Expo ทำงานได้ทั้ง Web, iOS, Android |
| 3. ระบบเข้าสู่ระบบ (Login) | ✅ เสร็จสมบูรณ์ | ตรวจสอบสิทธิ์ Username: `admin` และ Password: `admin123` |
| 4. จัดการข้อมูลพนักงาน (CRUD) | ✅ เสร็จสมบูรณ์ | เพิ่ม (Create), แสดง/ค้นหา/กรอง (Read), แก้ไข (Update), ลบ (Delete), เปลี่ยนสถานะ Active/Inactive |
| 5. ข้อมูลใน In-Memory อย่างน้อย 5 คน | ✅ เสร็จสมบูรณ์ | มีข้อมูลจำลองพนักงานเริ่มต้น 7 คน (เกินเกณฑ์ที่กำหนด) |
| 6. วิเคราะห์เงินเดือนด้วย K-Means 3 กลุ่ม | ✅ เสร็จสมบูรณ์ | อัลกอริทึม 1D K-Means Clustering แบ่ง Tier 1, Tier 2, Tier 3 |
| 7. คำนวณเงินเดือนเฉลี่ย & จำนวนคน | ✅ เสร็จสมบูรณ์ | คำนวณ Average Salary, Employee Count, Centroid และสัดส่วน |
| 8. ใช้ JSON ในการส่งข้อมูลทั้งหมด | ✅ เสร็จสมบูรณ์ | สื่อสารระหว่าง Frontend และ Backend ด้วย JSON Format 100% พร้อม JSON Viewer |
| 9. หน้าลิงก์เชื่อมต่อทุกหน้า | ✅ เสร็จสมบูรณ์ | หน้าจอ `LinksScreen` ในแอป + หน้าเว็บ `http://localhost:5000/links` |
| 10. ซอร์สโค้ดบน GitHub | ✅ เสร็จสมบูรณ์ | Repository: [Theeradon18/employee-management-app](https://github.com/Theeradon18/employee-management-app) |
