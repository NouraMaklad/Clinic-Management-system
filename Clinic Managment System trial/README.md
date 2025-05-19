# Clinic Management System

The **Clinic Management System** is a full-stack web application for managing patients, doctors, and appointments in a clinic. It features a modern, responsive frontend with a professional design and a robust backend API.

---

## 📚 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Setup Instructions](#setup-instructions)
* [Running the Application](#running-the-application)
* [Testing the Application](#testing-the-application)
* [Troubleshooting](#troubleshooting)

---

## 📝 Overview

This project is divided into two components:

### 🔹 Backend: `ClinicManagementSystem.API`

* Built with **ASP.NET Core** and **Entity Framework Core**.
* Provides **RESTful APIs** for managing patients, doctors, and appointments.
* Uses **SQL Server (ClinicDb)** for persistent data storage.

### 🔹 Frontend: `ClinicManagementSystem.Web`

* Built with **HTML**, **CSS**, and **JavaScript**.
* Features a modern UI with cards, tables, and **Font Awesome** icons.
* Homepage includes a clinic image: `images/Clinic-Management-Software-Home-Page.jpg`.
* Served using **Live Server** via VS Code.

---

## ✨ Features

* **Patients**: Add, view, update, and delete patient records.
* **Doctors**: Manage doctor data including specialty and contact info.
* **Appointments**: Schedule and manage appointments with dropdowns.
* **Responsive UI**: Adapts for both desktop and mobile.
* **Modern Design**: Blue/white medical theme, hover effects, icons.
* **API Testing**: Integrated Swagger UI for endpoint testing.

---

## 🔧 Prerequisites

### Backend:

* [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
* SQL Server Express
* Entity Framework CLI:

  ```bash
  dotnet tool install --global dotnet-ef
  ```

### Frontend:

* [Visual Studio Code](https://code.visualstudio.com/)
* VS Code Live Server extension (`ritwickdey.liveserver`)

### Optional:

* Azure account for deployment
* Git for version control

---

## 🚀 Setup Instructions

### 1. Clone or Extract Project

Using Git:

```bash
git clone <your-repo-url>
```

Or extract the ZIP to a folder (e.g., `C:\ClinicManagementSystem`).

Expected structure:

```
ClinicManagementSystem/
├── ClinicManagementSystem.API/
├── ClinicManagementSystem.Web/
│   ├── images/
│   │   └── Clinic-Management-Software-Home-Page.jpg
│   ├── index.html
│   ├── patients.html
│   ├── doctors.html
│   ├── appointments.html
│   ├── main.js
│   ├── styles.css
└── README.md
```

### 2. Set Up SQL Server

* Install **SQL Server Express** if needed.
* Open **SSMS** and connect to `localhost\SQLEXPRESS`.
* Optional: Restore `ClinicDb.bak` via **Restore Database**.

---

## ⚙️ Configure Backend

### 1. Navigate to API directory:

```bash
cd ClinicManagementSystem.API
```

### 2. Restore dependencies:

```bash
dotnet restore
```

### 3. Install Swagger:

```bash
dotnet add package Swashbuckle.AspNetCore --version 6.7.3
```

### 4. Update `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=ClinicDb;Trusted_Connection=True;"
}
```

### 5. Create the database:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 🖥️ Verify Frontend Setup

Ensure the following files exist:

* `images/Clinic-Management-Software-Home-Page.jpg`
* `index.html`, `patients.html`, `doctors.html`, `appointments.html`
* `main.js`, `styles.css`

In `main.js`:

```js
const apiUrl = 'http://localhost:5237/api';
```

---

## ▶️ Running the Application

### 1. Run the Backend

```bash
cd ClinicManagementSystem.API
dotnet run --environment Development
```

Verify Swagger at: [http://localhost:5237/swagger](http://localhost:5237/swagger)

### 2. Run the Frontend

* Open `ClinicManagementSystem.Web` in VS Code.
* Install Live Server (if not installed).
* Right-click `index.html` → **Open with Live Server**.

Access: [http://127.0.0.1:5500](http://127.0.0.1:5500)

---

## 🧪 Testing the Application

### Homepage

* Image should load properly.
* Navigation links should work.

### Patients Page

* Add: `Jane Doe, jane@example.com, 9876543210, 1995-02-15`
* Edit: Change email to `jane.doe@example.com`
* Delete and verify record removal.

### Doctors Page

* Add: `Maryam Yasser, Dermatologist, maryam@ejust.edu.eg`
* Edit and delete functionality.
* Confirm UI elements are styled properly.

### Appointments Page

* Schedule: Select `Jane Doe`, `Maryam Yasser`, `2025-05-17T12:00`, Reason: `Checkup`
* Test edit/delete features.
* Dropdowns should auto-populate.

### Database

Open SSMS and run:

```sql
SELECT * FROM ClinicDb.dbo.Patients;
SELECT * FROM ClinicDb.dbo.Doctors;
SELECT * FROM ClinicDb.dbo.Appointments;
```

Or use Swagger:

#### Sample Patient

```json
POST /api/Patients
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1995-02-15T00:00:00"
}
```

#### Sample Doctor

```json
POST /api/Doctors
{
  "firstName": "Maryam",
  "lastName": "Yasser",
  "specialty": "Dermatologist",
  "email": "maryam@ejust.edu.eg",
  "phone": "123456789"
}
```

#### Sample Appointment

```json
POST /api/Appointments
{
  "patientId": 1,
  "doctorId": 1,
  "appointmentDate": "2025-05-17T12:00:00",
  "reason": "Checkup"
}
```

---

## 📱 Responsive Design

* Test on mobile using DevTools (F12 > Toggle Device Toolbar).
* Check responsiveness and element scaling.

---

## 🌐 Compatibility

* Test on latest versions of **Chrome**, **Firefox**, and **Edge**.
* Check browser console (F12) for any errors.

---

## 🛠️ Troubleshooting

### Backend Issues

* **Swagger not loading**: Ensure `Program.cs` includes:

  ```csharp
  app.UseSwagger();
  app.UseSwaggerUI();
  ```

* **Database issues**: Double-check connection string and SQL Server service.

* **Port conflicts**: Modify `launchSettings.json` port (e.g., `5238`).

### Frontend Issues

* **Missing image**: Verify the file path and name.

* **404 errors**: Ensure all files are present in `ClinicManagementSystem.Web`.

* **CORS errors**: Add in `Program.cs`:

  ```csharp
  builder.Services.AddCors(options => {
      options.AddPolicy("AllowAll", builder => {
          builder.WithOrigins("http://127.0.0.1:5500")
                 .AllowAnyMethod()
                 .AllowAnyHeader();
      });
  });
  app.UseCors("AllowAll");
  ```

### General

* Confirm .NET 9.0 SDK and Live Server are installed.
* Check SSMS tables:

  ```sql
  SELECT * FROM ClinicDb.dbo.Patients;
  ```
