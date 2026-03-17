# Maplewood High School — Course Planning System

A full-stack web application that allows students to browse courses, plan their semester schedule, and track graduation progress.

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Backend  | Java 17, Spring Boot 3.2, Spring Data JPA, Flyway   |
| Frontend | React 18, TypeScript, Redux Toolkit, Material UI 5  |
| Database | SQLite (pre-populated with 400 students, 57 courses) |
| Testing  | JUnit 5 + Mockito (backend), Jest (frontend)        |

## Features

- **Course Browser** — paginated catalog with grade/semester filters, section details, and enrollment
- **Schedule Builder** — weekly grid view, enrolled courses table, drop with confirmation
- **Student Dashboard** — GPA, credits earned, graduation progress bar, course history
- **Enrollment Validation** — prerequisite checks, time conflict detection, max 5 courses, grade level, capacity

## Project Structure

```
├── backend/
│   └── src/main/java/com/maplewood/
│       ├── controller/       # REST endpoints (courses, students, enrollments)
│       ├── service/          # Business logic + ValidationService
│       ├── repository/       # Spring Data JPA repositories
│       ├── model/            # JPA entities
│       ├── dto/              # Response DTOs with builder pattern
│       ├── enums/            # CourseType, EnrollmentStatus, CourseStatus, etc.
│       ├── exception/        # Custom exceptions + global handler
│       └── config/           # CORS configuration
│   └── src/main/resources/
│       └── db/migration/     # Flyway migrations (V1–V3)
│   └── src/test/java/        # Service + controller tests (52 tests)
│
├── frontend/src/
│   ├── components/           # React components (courses, schedule, dashboard, common, layout)
│   ├── store/slices/         # Redux Toolkit slices (courses, schedule, student)
│   ├── api/                  # Axios API client
│   ├── types/                # TypeScript interfaces
│   ├── constants/            # Theme, schedule grid constants
│   ├── utils/                # Formatting helpers
│   └── __tests__/            # Jest tests (34 tests)
│
├── maplewood_school.sqlite   # Pre-populated database
├── populate_database.py      # Script used to generate the base data
└── DATABASE.md               # Schema documentation
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 20+
- npm 9+

## Getting Started

### 1. Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The UI starts on **http://localhost:3000** and proxies API requests to port 8080.

### 3. Open the app

Navigate to http://localhost:3000. The default student ID is `1` — you can change it in the top-right input field.

## API Endpoints

| Method   | Endpoint              | Description                       |
|----------|-----------------------|-----------------------------------|
| `GET`    | `/courses`            | List courses (paginated, filterable by `grade`, `semester`) |
| `GET`    | `/courses/{id}`       | Get course details                |
| `GET`    | `/courses/sections`   | List sections (paginated, filterable by `courseId`) |
| `GET`    | `/students/{id}`      | Student profile with GPA, credits, course history |
| `GET`    | `/students/{id}/schedule` | Current semester schedule      |
| `POST`   | `/enrollments`        | Enroll in a section (`{ studentId, sectionId }`) |
| `DELETE` | `/enrollments/{id}`   | Drop an enrollment               |

## Business Rules

- Students must pass prerequisites before enrolling in dependent courses
- Maximum 5 courses per semester
- No time slot conflicts allowed
- Courses are grade-level restricted
- Sections have a capacity limit (enrollment count tracked)
- 30 credits required for graduation

## Database Migrations

Schema is managed by Flyway with three versioned migrations:

| Migration | Description |
|-----------|-------------|
| `V1__create_base_schema.sql` | Original tables (students, courses, teachers, etc.) |
| `V2__add_scheduling_tables.sql` | New tables: time_slots, course_sections, enrollments |
| `V3__seed_scheduling_data.sql` | Seed data for time slots and course sections |

## Running Tests

### Backend (52 tests)

```bash
cd backend
mvn test
```

Covers: `ValidationService`, `EnrollmentService`, `CourseService`, `StudentService`, `ScheduleService`, and all three controllers.

### Frontend (34 tests)

```bash
cd frontend
npm test
```

Covers: utility functions (`expandDays`, `formatTimeSlot`) and all Redux slices (courses, schedule, student).
