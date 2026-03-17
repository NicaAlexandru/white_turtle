# Maplewood High School — Course Planning System

Full-stack web application that lets students at Maplewood High browse the course catalog, build their semester schedule, and track graduation progress. The system enforces academic rules in real time — prerequisites, time conflicts, course limits — so students get immediate feedback when planning their semester.

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 20+
- npm 9+

## Build & Run

```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend (separate terminal)
cd frontend
npm install
npm start
```

Backend starts on http://localhost:8080. Frontend starts on http://localhost:3000 and proxies API requests to port 8080.

On first run, Flyway applies the database migrations automatically — no manual SQL setup needed.

Open http://localhost:3000 and enter a student ID (default is `1`) in the top-right input field to get started.

## What It Does

The app has three main views:

**Course Browser** — Paginated catalog with grade level and semester filters. Students can view course details (credits, prerequisites, available sections) and enroll directly. The system validates everything before confirming — prerequisites, time conflicts, capacity, grade eligibility.

**Schedule Builder** — Weekly grid showing the current schedule at a glance. Courses are color-coded and placed in their time slots across the week. Below the grid, a table lists enrolled courses with the option to drop (with confirmation).

**Student Dashboard** — GPA, credits earned vs. required, graduation progress bar. Below that, the full course history with pass/fail status for every course taken.

## API

| Method   | Endpoint              | Description                       |
|----------|-----------------------|-----------------------------------|
| `GET`    | `/courses`            | List courses (paginated, filterable by `grade`, `semester`) |
| `GET`    | `/courses/{id}`       | Course details with prerequisite info |
| `GET`    | `/courses/sections`   | List sections (paginated, filterable by `courseId`) |
| `GET`    | `/students/{id}`      | Student profile with GPA, credits, course history |
| `GET`    | `/students/{id}/schedule` | Current semester schedule      |
| `POST`   | `/enrollments`        | Enroll in a section              |
| `DELETE` | `/enrollments/{id}`   | Drop an enrollment               |

### Enroll in a section

```bash
curl -X POST http://localhost:8080/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "sectionId": 5}'
```

```json
{
  "enrollmentId": 42,
  "message": "Successfully enrolled in ENG201",
  "scheduleEntry": {
    "enrollmentId": 42,
    "sectionId": 5,
    "courseId": 12,
    "courseCode": "ENG201",
    "courseName": "American Literature",
    "teacherName": "Sarah Mitchell",
    "classroomName": "Room 203",
    "days": "MWF",
    "startTime": "09:00",
    "endTime": "09:50"
  }
}
```

### Drop an enrollment

```bash
curl -X DELETE http://localhost:8080/enrollments/42
```

### Browse courses

```bash
curl "http://localhost:8080/courses?page=0&size=10&grade=10"
```

Returns a paginated response with `content`, `totalPages`, `totalElements`, and `number` (current page).

### Get student profile

```bash
curl http://localhost:8080/students/1
```

```json
{
  "id": 1,
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice.johnson@maplewood.edu",
  "gradeLevel": 10,
  "enrollmentYear": 2024,
  "expectedGraduationYear": 2028,
  "gpa": 3.45,
  "creditsEarned": 12.0,
  "creditsRequired": 30.0,
  "courseHistory": [
    {
      "courseCode": "MATH101",
      "courseName": "Algebra I",
      "credits": 3.0,
      "grade": "A",
      "status": "passed",
      "semesterName": "Fall 2024"
    }
  ]
}
```

### Errors

Validation failures return `409 Conflict`, missing resources return `404`. All errors follow the same shape:

```json
{"type": "PREREQUISITE", "message": "Must complete MATH101 before enrolling in MATH201"}
```

```json
{"type": "TIME_CONFLICT", "message": "Time conflict with ENG201 (MWF 09:00-09:50)"}
```

```json
{"type": "MAX_COURSES", "message": "Already enrolled in maximum of 5 courses"}
```

## Business Rules

These are enforced server-side in `ValidationService` before any enrollment is persisted:

- **Prerequisites** — student must have passed the prerequisite course (if any)
- **Max courses** — no more than 5 courses per semester
- **Time conflicts** — enrolled sections cannot overlap in days and times
- **Grade level** — course must be available for the student's grade
- **Capacity** — section must have available seats
- **Duplicates** — can't enroll in the same course twice in the same semester
- **Graduation** — 30 credits required, tracked on the dashboard

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Backend  | Java 17, Spring Boot 3.2, Spring Data JPA, Flyway   |
| Frontend | React 18, TypeScript, Redux Toolkit, Material UI 5  |
| Database | SQLite (pre-populated with 400 students, 57 courses) |
| Testing  | JUnit 5 + Mockito (backend), Jest (frontend)        |

## Design Decisions

**Flyway for schema management** — The project starts with a pre-populated SQLite database (students, courses, historical records). I needed to add new tables (time slots, course sections, enrollments) on top of it. Rather than relying on Hibernate's `ddl-auto` or a one-off init script, I went with Flyway so schema changes are versioned and repeatable. V1 captures the original schema, V2 adds the scheduling tables, V3 seeds section data. Adding a V4 later is straightforward.

**Dedicated ValidationService** — Enrollment validation involves six business rules (prerequisites, time conflicts, max courses, grade level, capacity, duplicates). This logic initially lived inside `EnrollmentService`, but it made that class hard to read and harder to test. Extracting it into its own service keeps enrollment clean — call `validate()`, then persist — and each rule can be tested in isolation.

**LAZY fetching + @EntityGraph** — Every JPA relationship is `LAZY` by default. EAGER fetching can silently load entire object graphs when you only need a single field, and that's a performance trap. When a specific endpoint actually needs related data (e.g., a course with its prerequisite and specialization), I use `@EntityGraph` to selectively fetch what's needed for that query. Avoids N+1 problems without the risk of loading half the database.

**Enums over strings** — Fields like `courseType`, `enrollmentStatus`, and `semesterSeason` started as plain strings. Moving them to Java enums catches typos at compile time and makes the code more readable. The enum values match what's stored in the database (`core`/`elective`, `enrolled`/`dropped`, etc.) so no `AttributeConverter` is needed.

**Redux Toolkit with domain slices** — Three slices (courses, schedule, student) each own their state and async thunks. Enrolling or dropping a course updates the schedule slice optimistically — the entry is added/removed locally without re-fetching. More on this in [Frontend Architecture](#frontend-architecture).

**Paginated API responses** — The catalog has 57 courses and many sections. Returning everything in one response works for small datasets but doesn't scale. Paginated endpoints with server-side filtering keep responses lean and the frontend responsive. Page size defaults to 10 but is configurable from the client.

**Component decomposition + CSS files** — Large components were split into focused sub-components and all styles moved to dedicated CSS files (no inline `sx` props). Each component is small enough to understand at a glance. See the component table in [Frontend Architecture](#frontend-architecture).

## Frontend Architecture

### State Management

The app uses Redux Toolkit with three domain slices:

- **`coursesSlice`** — course catalog and sections. Tracks pagination state, active filters (grade, semester), and loading status. Filter changes reset pagination to page 0 automatically.
- **`scheduleSlice`** — the student's current schedule plus enrollment actions. When the student enrolls, the returned schedule entry is pushed directly into the local state — no need to re-fetch the entire schedule. Same for drops: the entry is removed from the array immediately. This keeps the UI responsive without extra API calls. Validation errors from the backend (prerequisite failures, time conflicts, etc.) are stored in `validationError` and surfaced in the UI as alerts.
- **`studentSlice`** — student profile, GPA, credits, course history. Changing the student ID resets the slice to `idle` so everything reloads cleanly.

Each slice follows the same pattern: `createAsyncThunk` for API calls, with `pending`/`fulfilled`/`rejected` cases that update `status` (`'idle' | 'loading' | 'succeeded' | 'failed'`) and `error`. A shared `extractApiError` utility in `store/utils.ts` normalizes Axios errors into `{ type, message }` objects so error handling is consistent across slices.

### Component Organization

Components are grouped by feature:

| Folder         | Components | Purpose |
|----------------|------------|---------|
| `courses/`     | `CourseBrowser`, `CourseCard`, `CourseFilters`, `SectionPickerDialog` | Catalog browsing, filtering, section selection, enrollment |
| `schedule/`    | `ScheduleBuilder`, `ScheduleGrid`, `EnrolledCoursesTable`, `DropConfirmDialog` | Weekly grid view, enrolled courses list, drop flow |
| `dashboard/`   | `StudentDashboard`, `StatCard`, `GraduationProgress`, `CourseHistory` | Profile stats, progress tracking, course history table |
| `common/`      | `ErrorAlert`, `LoadingSpinner`, `SuccessSnackbar` | Reusable feedback components |
| `layout/`      | `AppLayout` | Header, tab navigation, student ID input |

Each feature folder has a main "container" component (`CourseBrowser`, `ScheduleBuilder`, `StudentDashboard`) that connects to Redux and passes data down to presentational sub-components. This keeps individual files small and focused.

### API Layer

Three API modules (`coursesApi`, `studentsApi`, `enrollmentsApi`) wrap an Axios client configured in `apiClient.ts`. The client has a response interceptor that logs errors. The frontend proxies all requests to `localhost:8080` via Create React App's built-in proxy, so no CORS preflight in development.

### Styling

All styles live in dedicated CSS files alongside their components (`CourseCard.css`, `ScheduleGrid.css`, `StudentDashboard.css`, `AppLayout.css`, `common.css`). No inline `sx` props — MUI components use `className` pointing to CSS rules. The MUI theme is configured in `constants/theme.ts`.

## Database

SQLite file at project root (`maplewood_school.sqlite`). Pre-populated with 400 students, 57 courses, teachers, classrooms, and course history. Schema details are in `DATABASE.md`.

`populate_database.py` is the Python script that was used to generate the initial base data.

### Flyway Migrations

| Migration | What it does |
|-----------|--------------|
| `V1__create_base_schema.sql` | Original tables — students, courses, teachers, classrooms, semesters, etc. |
| `V2__add_scheduling_tables.sql` | Adds time_slots, course_sections, enrollments with indexes |
| `V3__seed_scheduling_data.sql` | Seeds time slots and populates course sections for the active semester |

## Project Structure

```
├── backend/
│   └── src/main/java/com/maplewood/
│       ├── controller/       # REST endpoints
│       ├── service/          # Business logic + ValidationService
│       ├── repository/       # Spring Data JPA repositories
│       ├── model/            # JPA entities
│       ├── dto/              # Response/request DTOs (builder pattern)
│       ├── enums/            # CourseType, EnrollmentStatus, CourseStatus, SemesterSeason
│       ├── exception/        # Custom exceptions + global handler
│       └── config/           # CORS configuration
│   └── src/main/resources/
│       └── db/migration/     # Flyway migrations (V1–V3)
│   └── src/test/java/        # Service + controller tests
│
├── frontend/src/
│   ├── components/           # UI components (courses, schedule, dashboard, common, layout)
│   ├── store/slices/         # Redux slices (courses, schedule, student)
│   ├── api/                  # Axios API client
│   ├── types/                # TypeScript interfaces
│   ├── constants/            # Theme config, schedule grid constants
│   ├── utils/                # Formatting helpers (time slots, day expansion)
│   └── __tests__/            # Jest tests
│
├── maplewood_school.sqlite   # Pre-populated database
├── populate_database.py      # Script that generated the base data
└── DATABASE.md               # Schema reference
```

## Running Tests

### Backend (52 tests)

```bash
cd backend
mvn test
```

Covers all services (`ValidationService`, `EnrollmentService`, `CourseService`, `StudentService`, `ScheduleService`) and all three controllers. `ValidationService` tests cover each of the six business rules in isolation. Controller tests use `@WebMvcTest` with mocked services.

### Frontend (34 tests)

```bash
cd frontend
npm test
```

Covers utility functions (`expandDays`, `formatTimeSlot`) and all Redux slices — async thunks, reducers, loading states, and error handling.

## Assumptions

- SQLite is sufficient for this use case (single user, no concurrent writes)
- No authentication — student ID is entered manually in the UI
- The pre-populated database has realistic but synthetic data (generated by `populate_database.py`)
- The active semester is determined by the most recent semester in the database
- Frontend proxies to `localhost:8080` via Create React App's proxy setting
