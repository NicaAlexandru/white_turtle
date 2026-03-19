# Database Documentation

## Overview

The `maplewood_school.sqlite` file lives at the project root. It comes pre-populated with realistic sample data and is managed by Flyway — three versioned migrations handle the schema and seed data so you never need to run SQL manually.

## What's in there

| Entity | Count | Description |
|--------|-------|-------------|
| Students | 400 | 100 per grade level (9–12) |
| Courses | 57 | 20 core + 37 electives, with prerequisite chains |
| Teachers | 50 | Distributed across 9 specializations |
| Classrooms | 60 | Various types: regular rooms, labs, studios, gym |
| Semesters | 9 | 6 historical + 1 active (Fall 2024) + 2 future |
| Course history | ~6,500 | Pass/fail records for GPA and prerequisite validation |
| Specializations | 9 | Subject areas for teachers and courses |
| Room types | 8 | Classroom, science lab, art studio, gym, computer lab, music room, etc. |
| Time slots | 14 | 7 periods × 2 day patterns (MWF and TTh), lunch skipped |
| Course sections | 40 | Links a course to a teacher, classroom, and time slot for the active semester |
| Enrollments | varies | Which students are signed up for which sections |

## Tables and Relationships

### Core entities

**students** — 400 students evenly split across grades 9–12. Each has an enrollment year, expected graduation year, and email. GPA is calculated from their course history, not stored directly.

**courses** — 20 core courses (English, Math, Science, Social Studies) and 37 electives (Arts, Music, PE, CS, Languages). Each course has a credit value, a grade range it's open to, and an optional prerequisite. Semester ordering (Fall = 1, Spring = 2) controls when courses are offered.

**teachers** — 50 teachers, each tied to one specialization. Limited to 4 teaching hours per day. Distribution: Math (8), English (8), Science (10), Social Studies (6), Arts (4), Music (4), PE (4), CS (3), Foreign Language (3).

**classrooms** — 60 rooms across 3 floors. 30 standard classrooms, 10 science labs, 6 art studios, 3 gyms, 6 computer labs, 5 music rooms. Each capped at 10 students.

**semesters** — Fall and Spring semesters with `order_in_year` (1 for Fall, 2 for Spring). The active semester is Fall 2024. Historical semesters give students realistic academic progression.

**student_course_history** — About 6,500 records tracking which courses each student passed or failed in which semester. This is what drives prerequisite checks, GPA calculation, and credit totals. Roughly 85% pass rate.

### Scheduling tables (added in V2)

**time_slots** — 14 slots covering a school day from 8 AM to 4 PM. Seven one-hour periods on two day patterns (MWF and TTh). The lunch hour (12–1 PM) is skipped.

**course_sections** — Each row is a specific section: one course, one teacher, one classroom, one time slot, one semester. Core courses have two sections (A and B), electives have one (A). 40 sections total for the active semester. Teachers and classrooms are assigned round-robin within their specialization/room type so there are no conflicts.

**enrollments** — When a student enrolls in a section, a row goes here with status `enrolled`. Dropping changes it to `dropped`. Unique on (student_id, section_id) so a student can't double-enroll in the same section.

### Configuration tables

**specializations** — Nine subject areas (Mathematics, English, Science, etc.). Links teachers to their field and maps to the preferred room type (e.g., Science → science_lab).

**room_types** — Defines classroom categories. Used to match courses with appropriate rooms during section assignment.

## Prerequisite chains

Courses build on each other through prerequisite links. A few examples:

```
Math:    MAT101 → MAT102 → MAT201 → MAT202 → MAT301
English: ENG101 → ENG102 → ENG201 → ENG202 → ENG301 → ENG302 → ENG401 → ENG402
Science: SCI101 → SCI201 → SCI301
Spanish: SPAN101 → SPAN201 → SPAN301
```

## Constraints and triggers

The database enforces a few rules at the SQL level, independent of the application:

- **Prerequisite ordering** — a trigger prevents inserting a course whose prerequisite has a later `semester_order` in the same grade level. Keeps the catalog logically consistent.
- **Prerequisite completion** — a trigger on `student_course_history` blocks inserts if the student hasn't passed the prerequisite. The app also checks this in `ValidationService`, so this is a safety net.
- **No duplicate passes** — another trigger prevents a student from being marked as having passed a course they already passed.
- **Capacity and hours** — CHECK constraints cap classroom capacity at 10 and teacher daily hours at 4.
- **Semester naming** — a CHECK constraint ensures Fall maps to `order_in_year = 1` and Spring to `order_in_year = 2`.

## Flyway migrations

All three live under `backend/src/main/resources/db/migration/`:

| File | What it does |
|------|-------------|
| `V1__create_base_schema.sql` | The original 8 tables (students, courses, teachers, classrooms, semesters, student_course_history, specializations, room_types), indexes, and triggers |
| `V2__add_scheduling_tables.sql` | Adds `time_slots`, `course_sections`, and `enrollments` with indexes |
| `V3__seed_scheduling_data.sql` | Populates the 14 time slots and 40 course sections for the active semester |

## Useful queries

```sql
-- Fall courses available to 10th graders
SELECT code, name, credits, hours_per_week
FROM courses
WHERE grade_level_min <= 10 AND grade_level_max >= 10 AND semester_order = 1;

-- A student's GPA and credit total
SELECT s.first_name, s.last_name,
       SUM(CASE WHEN sch.status = 'passed' THEN c.credits ELSE 0 END) as credits_earned,
       ROUND(SUM(CASE WHEN sch.status = 'passed' THEN c.credits ELSE 0 END)
             / SUM(c.credits) * 4.0, 2) as gpa
FROM students s
JOIN student_course_history sch ON s.id = sch.student_id
JOIN courses c ON sch.course_id = c.id
WHERE s.id = 220
GROUP BY s.id;

-- Check prerequisite chain for a course
SELECT c.code, c.name, p.code as prerequisite
FROM courses c
LEFT JOIN courses p ON c.prerequisite_id = p.id
WHERE c.code = 'MAT201';

-- Sections for the active semester with teacher and room info
SELECT cs.section_number, c.code, c.name,
       t.first_name || ' ' || t.last_name as teacher,
       cl.name as room, ts.days, ts.start_time, ts.end_time
FROM course_sections cs
JOIN courses c ON cs.course_id = c.id
JOIN teachers t ON cs.teacher_id = t.id
JOIN classrooms cl ON cs.classroom_id = cl.id
JOIN time_slots ts ON cs.time_slot_id = ts.id
JOIN semesters sem ON cs.semester_id = sem.id
WHERE sem.is_active = 1
ORDER BY ts.id, cs.section_number;
```
