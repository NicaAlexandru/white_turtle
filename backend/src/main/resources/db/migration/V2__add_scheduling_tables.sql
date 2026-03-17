-- ===========================================================================
-- V2: Scheduling tables — time_slots, course_sections, enrollments
-- These support the course planning / enrollment features.
-- ===========================================================================

-- Time Slots
CREATE TABLE IF NOT EXISTS time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_name VARCHAR(30) NOT NULL,
    days VARCHAR(10) NOT NULL,
    start_time VARCHAR(5) NOT NULL,
    end_time VARCHAR(5) NOT NULL,
    UNIQUE(days, start_time)
);

-- Course Sections
CREATE TABLE IF NOT EXISTS course_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_number VARCHAR(10) NOT NULL,
    course_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    classroom_id INTEGER NOT NULL,
    time_slot_id INTEGER NOT NULL,
    semester_id INTEGER NOT NULL,
    max_capacity INTEGER NOT NULL DEFAULT 10,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id),
    FOREIGN KEY (semester_id) REFERENCES semesters(id),
    UNIQUE(course_id, section_number, semester_id)
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped')),
    enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (section_id) REFERENCES course_sections(id),
    UNIQUE(student_id, section_id)
);

-- Indexes for scheduling queries
CREATE INDEX IF NOT EXISTS idx_section_semester ON course_sections(semester_id);
CREATE INDEX IF NOT EXISTS idx_section_course ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_section ON enrollments(section_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_status ON enrollments(status);
