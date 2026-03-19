# Maplewood High School — Course Planning System

Full-stack app for browsing courses, building semester schedules, and tracking graduation progress at Maplewood High. Enforces academic rules (prerequisites, time conflicts, course limits) in real time so students get immediate feedback while planning.

## Prerequisites

- Java 17+, Maven 3.8+
- Node.js 20+, npm 9+

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

Backend runs on http://localhost:8080, frontend on http://localhost:3000 (proxies API calls to 8080).

Flyway handles all database setup on first start — no manual SQL needed.

Once both are running, open http://localhost:3000 and type a student ID in the top bar to load their profile. See [Using the App](#using-the-app) for a walkthrough.

## What It Does

Three tabs:

- **Course Browser** — paginated catalog with search, grade/semester filters. Click into a course to see sections and enroll. The backend validates every enrollment attempt and returns clear error messages on failure.
- **Schedule Builder** — weekly grid with color-coded time slots. Shows enrolled courses and lets you drop them (with confirmation).
- **Dashboard** — GPA, credits earned vs. required, graduation progress bar, and the full course history.

## Using the App

The UI is designed as an advisor view — you can look up any student by ID, review their record, and manage enrollments on their behalf.

### Loading a student

Enter a student ID in the header and press Enter. A few good ones to try:

| ID  | Name              | Grade | GPA  | Credits | What you'll see |
|-----|-------------------|-------|------|---------|-----------------|
| 1   | Laura Gonzalez    | 9     | 0.00 | 0 / 30  | Clean slate, no history — good for testing enrollment from scratch |
| 106 | Jennifer Martinez | 10    | 2.95 | 6.5 / 30 | Some prerequisites already met, a couple of failed courses |
| 220 | Jessica Rodriguez | 11    | 3.00 | 12 / 30 | Lots of history, mid-progress |
| 350 | Ruth Wright       | 12    | 3.00 | 22.5 / 30 | Near graduation, 30 courses completed |

### Browsing and enrolling

In Course Browser, search by name or code ("Art", "MAT101"), filter by grade level or semester, and adjust page size (12/24/48). Click "View Sections" on any course to see the available sections with schedules, teachers, and seat counts. Select a section and confirm enrollment in the dialog.

### Validations you can trigger

The system enforces six rules on every enrollment. Here's a concrete walkthrough using **student 1** (Laura Gonzalez, grade 9 — starts with nothing):

1. Enroll in **ENG101** section A (MWF 08:00–09:00) — works fine.
2. Try **SCI101** section A — same time slot, blocked as a **time conflict**.
3. Enroll in **MAT101** section A (TTh 09:00–10:00) — works.
4. Try **ENG101** section B — blocked, **already enrolled** in that course.
5. Try **CS401** (Computer Science Projects) — blocked, **grade 12 only**.
6. Try **ART201** (Art II: Painting) — blocked, **prerequisite** ART101 not passed.
7. Enroll in three more (SPORT101, CS101, MUS101) to hit 5 total.
8. Try **DRAMA101** — blocked, **max 5 courses** per semester.
9. Drop MUS101 from Schedule Builder, then enroll in DRAMA101 — now it works.

For the "already passed" check, switch to **student 220** (Jessica Rodriguez). She already passed CS101 in a previous semester, so trying to enroll in CS101 again gets blocked. But CS301 (Advanced Programming) works because she has the prerequisite.

Capacity is also enforced but harder to demo since sections have 25-30 seats.

### Schedule and progress

After enrolling, switch to Schedule Builder — the grid updates immediately. Drop a course and it disappears from the grid.

Back on Dashboard, the credit count and graduation bar reflect the student's current state. Compare student 1 (0/30 credits) with student 350 (22.5/30).

## API

| Method   | Endpoint              | Description |
|----------|-----------------------|-------------|
| `GET`    | `/courses`            | Paginated course list, filterable by `grade`, `semester`, `search` |
| `GET`    | `/courses/{id}`       | Single course with prerequisite info |
| `GET`    | `/courses/sections`   | Paginated sections, filterable by `courseId` |
| `GET`    | `/students/{id}`      | Profile with GPA, credits, course history |
| `GET`    | `/students/{id}/schedule` | Current semester schedule |
| `POST`   | `/enrollments`        | Enroll in a section |
| `DELETE` | `/enrollments/{id}`   | Drop an enrollment |

### Examples

Enroll:
```bash
curl -X POST http://localhost:8080/enrollments \
  -H "Content-Type: application/json" \
  -d '{"studentId": 1, "sectionId": 5}'
```

Drop:
```bash
curl -X DELETE http://localhost:8080/enrollments/42
```

Browse courses (paginated, filtered):
```bash
curl "http://localhost:8080/courses?page=0&size=10&grade=10&search=math"
```

Get a student profile:
```bash
curl http://localhost:8080/students/220
```

### Error responses

Validation failures return `409 Conflict`, missing resources return `404`:

```json
{"type": "prerequisite", "message": "Missing prerequisite: Algebra I (MAT101) must be passed before enrolling in Geometry"}
```
```json
{"type": "conflict", "message": "Time conflict: Biology I (MWF 08:00-09:00) conflicts with English I (MWF 08:00-09:00)"}
```
```json
{"type": "max_courses", "message": "Maximum of 5 courses per semester reached (currently enrolled in 5)"}
```

## Business Rules

Enforced server-side in `ValidationService` before any enrollment is persisted:

- **Prerequisites** — must have passed the prerequisite course
- **Grade level** — course must be available for the student's grade
- **Duplicates** — can't enroll in a course you're already taking or have already passed
- **Max courses** — 5 per semester
- **Time conflicts** — no overlapping sections
- **Capacity** — section must have open seats
- **Graduation** — 30 credits required, tracked on the dashboard

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 17, Spring Boot 3.2, Spring Data JPA, Flyway |
| Frontend | React 18, TypeScript, Redux Toolkit, Material UI 5 |
| Database | SQLite (pre-populated — 400 students, 57 courses) |
| Testing  | JUnit 5 + Mockito (backend), Jest (frontend) |

## Design Decisions

**Flyway for schema management** — the project ships with a pre-populated SQLite database. I needed to add scheduling tables on top of it without touching the existing data. Flyway versions these changes: V1 captures the original schema, V2 adds the new tables, V3 seeds the section data. Easy to extend with a V4 later.

**Dedicated ValidationService** — enrollment validation has six rules that would clutter `EnrollmentService` if left inline. Pulling them into their own class makes the enrollment flow straightforward (validate, then persist) and each rule testable in isolation.

**LAZY fetching + @EntityGraph** — all JPA relationships default to LAZY. When a specific query needs related data (e.g., course with its prerequisite), I use `@EntityGraph` to fetch just what's needed. This avoids both N+1 queries and the performance trap of accidentally loading entire object trees.

**Enums over strings** — status fields (`core`/`elective`, `enrolled`/`dropped`, `passed`/`failed`) are Java enums. Catches bugs at compile time and the values match the database directly, so no converter needed.

**Redux slices by domain** — three slices (courses, schedule, student), each owning their state and async thunks. Enrollment and drop actions update local state immediately without re-fetching. Validation errors from the API are stored in the slice and surfaced as alerts.

**Paginated endpoints** — 57 courses and many sections. Server-side pagination with filtering keeps responses small. Page size defaults to 10, configurable from the client.

**Component decomposition** — large components were split into focused sub-components. Styles live in CSS files next to their components instead of inline `sx` props.

## Frontend Details

### State management

Each Redux slice follows the same shape: `createAsyncThunk` for API calls, `pending`/`fulfilled`/`rejected` handlers for loading states. A shared `extractApiError` utility normalizes Axios errors so error handling is consistent.

The schedule slice does optimistic updates — enrolling pushes the new entry into the local array, dropping removes it. No full re-fetch needed.

### Components

| Folder | What's in it |
|--------|-------------|
| `courses/` | `CourseBrowser`, `CourseCard`, `CourseFilters`, `SectionPickerDialog` |
| `schedule/` | `ScheduleBuilder`, `ScheduleGrid`, `EnrolledCoursesTable`, `DropConfirmDialog` |
| `dashboard/` | `StudentDashboard`, `StatCard`, `GraduationProgress`, `CourseHistory` |
| `common/` | `ErrorAlert`, `LoadingSpinner`, `SuccessSnackbar` |
| `layout/` | `AppLayout` |

Each feature folder has a container component that connects to Redux and passes data to presentational sub-components.

### API layer

Three modules (`coursesApi`, `studentsApi`, `enrollmentsApi`) wrapping an Axios client. The frontend proxies everything to `localhost:8080` via CRA's built-in proxy — no CORS config needed in dev.

### Styling

CSS files live next to their components. MUI components use `className` instead of inline styles. Theme is in `constants/theme.ts`.

## Database

SQLite file at project root (`maplewood_school.sqlite`). Pre-populated with students, courses, teachers, classrooms, semesters, and course history. `populate_database.py` is the script that generated this data. Schema reference in `DATABASE.md`.

### Flyway migrations

| File | What it does |
|------|-------------|
| `V1__create_base_schema.sql` | Original tables (students, courses, teachers, etc.) |
| `V2__add_scheduling_tables.sql` | time_slots, course_sections, enrollments + indexes |
| `V3__seed_scheduling_data.sql` | Populates time slots and course sections for the active semester |

## Project Structure

```
backend/src/main/java/com/maplewood/
  controller/       REST endpoints
  service/          Business logic + ValidationService
  repository/       Spring Data JPA repos
  model/            JPA entities
  dto/              Response DTOs (builder pattern)
  enums/            CourseType, EnrollmentStatus, CourseStatus, SemesterSeason
  exception/        Custom exceptions + global handler
  config/           CORS

backend/src/main/resources/
  db/migration/     Flyway V1–V3

backend/src/test/java/
                    Service + controller tests

frontend/src/
  components/       UI (courses, schedule, dashboard, common, layout)
  store/slices/     Redux (courses, schedule, student)
  api/              Axios client + API modules
  types/            TypeScript interfaces
  constants/        Theme, schedule grid constants
  utils/            Formatting helpers
  __tests__/        Jest tests
```

## Tests

**Backend** (52 tests):
```bash
cd backend && mvn test
```

Covers all five services and three controllers. `ValidationService` tests each of the six business rules. Controller tests use `@WebMvcTest` with mocked services.

**Frontend** (34 tests):
```bash
cd frontend && npm test
```

Covers utility functions and all three Redux slices (thunks, reducers, error handling).

## Assumptions

- SQLite is fine here — single user, no concurrent writes
- No authentication. The app works as an advisor/registrar view where you look up students by ID. Adding auth would be straightforward but wasn't the point of this exercise.
- Data is synthetic, generated by `populate_database.py`
- Active semester = latest semester in the database
- Frontend proxies to `localhost:8080` via CRA's proxy config
