<div align="center">

<img src="https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" />
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-Secured-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

<br/><br/>

# 🩺 Doctor Appointment Scheduler

### A modern full-stack web application for seamless doctor appointment booking and management.

<br/>

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🛠️ Setup & Installation](#️-setup--installation)
- [🔐 API Endpoints](#-api-endpoints)
- [📧 Email Configuration](#-email-configuration-optional)
- [📌 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication & Authorization
- Secure login/signup using **JWT**
- Role-based access control:
  - `PATIENT` 🧑‍💼
  - `DOCTOR` 👨‍⚕️
  - `ADMIN` 🛡️

### 👨‍⚕️ Doctor Module
- Manage profile & specialization
- Create and manage available time slots
- View and update appointment status

</td>
<td width="50%">

### 👩‍💻 Patient Module
- Search doctors by **name** or **specialization**
- Book appointments with available slots
- View & cancel appointments

### 🛡️ Admin Module
- Manage doctor accounts
- Monitor all appointments across the platform

### 📧 Email Notifications
- Appointment confirmation emails
- Optional reminder emails

</td>
</tr>
</table>

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| 🖥️ Backend | Spring Boot 3.x, Java 17 |
| 🌐 Frontend | React 18, React Router |
| 🗄️ Database | MySQL 8 |
| 🔒 Security | Spring Security + JWT |
| 🔧 Build Tool | Maven |
| 🧪 API Testing | Postman |

---

## 📁 Project Structure

```
doctor-appointment-scheduler/
│
├── 📂 backend/
│   └── src/main/java/com/appointment/scheduler/
│       ├── config/         # Security, JWT, CORS
│       ├── controller/     # REST Controllers
│       ├── dto/            # Request/Response DTOs
│       ├── entity/         # JPA Entities
│       ├── exception/      # Global Exception Handling
│       ├── repository/     # JPA Repositories
│       └── service/        # Business Logic
│
└── 📂 frontend/
    └── src/
        ├── api/            # Axios Config
        ├── components/
        │   ├── auth/
        │   ├── patient/
        │   ├── doctor/
        │   └── admin/
        ├── context/        # Auth Context
        └── styles/
```

---

## ⚙️ Prerequisites

Make sure you have the following installed before getting started:

| Tool | Version |
|---|---|
| ☕ Java | 17+ |
| 🟢 Node.js | 18+ |
| 🐬 MySQL | 8+ |
| 📦 Maven | Latest |

---

## 🛠️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/doctor-appointment-scheduler.git
cd doctor-appointment-scheduler
```

---

### 2️⃣ Database Setup

```sql
CREATE DATABASE doctor_appointment_db;
```

---

### 3️⃣ Backend Setup

```bash
cd backend
```

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/doctor_appointment_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run the backend:

```bash
# Linux / macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

> 🔗 Backend runs at: **http://localhost:8080**

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

> 🔗 Frontend runs at: **http://localhost:3000**

---

## 🔐 API Endpoints

### 🔑 Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

---

### 👨‍⚕️ Doctor APIs *(Protected)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/doctor/profile` | Get doctor profile |
| `PUT` | `/api/doctor/profile` | Update doctor profile |
| `POST` | `/api/doctor/slots` | Add a new time slot |
| `DELETE` | `/api/doctor/slots/{id}` | Delete a time slot |
| `GET` | `/api/doctor/appointments` | View all appointments |
| `PUT` | `/api/doctor/appointments/{id}/status` | Update appointment status |

---

### 🌍 Public Doctor APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/doctor/all` | Get all doctors |
| `GET` | `/api/doctor/{id}` | Get doctor by ID |
| `GET` | `/api/doctor/search/specialization` | Search by specialization |
| `GET` | `/api/doctor/search/name` | Search by name |

---

### 👩‍💻 Patient APIs *(Protected)*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/patient/appointments` | Book an appointment |
| `GET` | `/api/patient/appointments` | View all appointments |
| `PUT` | `/api/patient/appointments/{id}/cancel` | Cancel an appointment |

---

### 🛡️ Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/doctors` | Get all doctors |
| `GET` | `/api/admin/appointments` | Get all appointments |

---

### 👑 Default Admin Setup

Insert a default admin user into the database:

```sql
INSERT INTO users (full_name, email, password, role, enabled)
VALUES ('Admin', 'admin@example.com', '$2a$10$YOUR_BCRYPT_HASH', 'ROLE_ADMIN', true);
```

> 💡 Generate a BCrypt hash using [Spring's BCryptPasswordEncoder](https://docs.spring.io/spring-security/reference/) or any online BCrypt tool.

---

## 📧 Email Configuration *(Optional)*

Add the following to `application.properties` to enable email notifications:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 📌 Future Enhancements

- 🔔 Real-time notifications via **WebSockets**
- 💳 **Online payment** integration
- 📅 **Google Calendar** sync
- ⭐ Doctor **ratings & reviews** system

---

## 🤝 Contributing

Contributions are always welcome! 🎉

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a **Pull Request**

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 💡 Author

**Vaishnavi Pawale**
*Java Full Stack Developer 🚀*

<br/>

⭐ **If you found this project helpful, please give it a star on GitHub!** ⭐

</div>
