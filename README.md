# 🏥 Doctor-Patient Management System

A full-stack, decoupled enterprise web application designed to manage doctor directories and patient registries. Built with a React/Vite frontend and a Spring Boot/JWT backend, focusing on high performance, secure stateless authentication, and a responsive modern UI.

## 🚀 Tech Stack

**Frontend Architecture**
* **Framework:** React 18 (Bootstrapped via Vite)
* **HTTP Client:** Axios (with automated request interceptors)
* **Styling:** Bootstrap 5 & Custom CSS (Modern Light Enterprise Theme)
* **State Management:** React Hooks (`useState`, `useEffect`)

**Backend Architecture**
* **Framework:** Spring Boot 3.x
* **Security:** Spring Security & JSON Web Tokens (JWT)
* **Persistence:** Spring Data JPA / Hibernate
* **Database:** MySQL 8.x
* **Build Tool:** Maven

---

## ✨ Core Features
* **Stateless Authentication:** Secure JWT-based login mechanism.
* **Interceptor-Driven API Calls:** Axios globally configured to inject Bearer tokens into request headers.
* **Full CRUD Operations:** Add, view, edit, and delete records for both Doctors and Patients.
* **Global CORS Configuration:** Backend natively configured to accept cross-origin requests from frontend development servers.
* **Responsive Layout:** Grid-based Bootstrap UI designed for both desktop and mobile environments.

---

## 🛠️ Local Development Setup

### Prerequisites
Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v20.x or higher)
* [Java Development Kit (JDK)](https://adoptium.net/) (v17 or higher)
* [MySQL Server](https://dev.mysql.com/downloads/installer/) (v8.x)
* [Git](https://git-scm.com/)

### 1. Database Configuration
Log into your local MySQL server and create the required database:
```sql
CREATE DATABASE doctor_patient_db;

```

### 2. Backend Setup (Spring Boot)

1. Navigate to the backend directory.
2. Update the `src/main/resources/application.properties` file with your local MySQL credentials and a secure JWT secret:
```properties
spring.application.name=doctor-patient-app
spring.datasource.url=jdbc:mysql://localhost:3306/doctor_patient_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
app.jwt.secret=YOUR_SUPER_SECRET_KEY_REPLACE_THIS
server.port=8085

```


3. Run the application via your IDE or using the Maven wrapper:
```bash
./mvnw spring-boot:run

```


*The backend will boot up and expose the API on `http://localhost:8085`.*

### 3. Frontend Setup (React/Vite)

1. Navigate to the frontend directory:
```bash
cd frontend

```


2. Install the required NPM packages:
```bash
npm install

```


3. Start the Vite development server:
```bash
npm run dev

```


*The frontend will boot up, typically on `http://localhost:5173`. Open this URL in your browser.*

---

## 📡 API Reference

All requests to `/api/doctors` and `/api/patients` require a valid JWT passed in the `Authorization` header as a Bearer token.

| Endpoint | Method | Security | Description | Payload |
| --- | --- | --- | --- | --- |
| `/api/auth/login` | `POST` | Public | Authenticates user and returns JWT. | `{ username, password }` |
| `/api/doctors` | `GET` | JWT | Retrieves all doctors. | - |
| `/api/doctors` | `POST` | JWT | Creates a new doctor record. | `{ doctorName, specialization, email }` |
| `/api/doctors/{id}` | `PUT` | JWT | Updates an existing doctor. | `{ doctorName, specialization, email }` |
| `/api/doctors/{id}` | `DELETE` | JWT | Removes a doctor record. | - |
| `/api/patients` | `GET` | JWT | Retrieves all patients. | - |
| `/api/patients` | `POST` | JWT | Creates a new patient record. | `{ patientName, age, disease }` |
| `/api/patients/{id}` | `PUT` | JWT | Updates an existing patient. | `{ patientName, age, disease }` |
| `/api/patients/{id}` | `DELETE` | JWT | Removes a patient record. | - |

---

## 🔐 Security Flow Details

1. **Authentication:** The client submits credentials to `/api/auth/login`. If valid, the server cryptographically signs a JSON Web Token (using the `app.jwt.secret`) and returns it.
2. **Storage:** The React client stores this token in browser `localStorage`.
3. **Authorization:** The Axios interceptor (`src/api.js`) captures all outgoing HTTP requests and appends `Authorization: Bearer <token>`.
4. **Validation:** The Spring Boot `JwtFilter` intercepts incoming requests, parses the token, verifies the cryptographic signature, and sets the `SecurityContext` allowing the request to proceed to the Controllers.

---

## 🐛 Troubleshooting

* **CORS Errors in Browser Console:** Ensure your backend `CorsConfig.java` is correctly mapping to `/` and allowing the specific port your Vite app is running on.
* **403 Forbidden on API Calls:** Your JWT has expired (set to 24 hours by default in `JwtUtil.java`) or the `Authorization` header is missing. Click "Logout" in the UI to clear local storage and log in again.
* **Port Conflicts:** If `8085` is in use, change `server.port` in `application.properties` AND update the `baseURL` inside `src/api.js` on the frontend to match.

```

```
