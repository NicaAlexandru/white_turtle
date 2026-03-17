-- ===========================================================================
-- V3: Seed data for time_slots and course_sections.
-- All statements use INSERT OR IGNORE for idempotency.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Time Slots: 7 periods × 2 day patterns = 14 slots (lunch 12-1pm skipped)
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 1', 'MWF', '08:00', '09:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 2', 'MWF', '09:00', '10:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 3', 'MWF', '10:00', '11:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 4', 'MWF', '11:00', '12:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 5', 'MWF', '13:00', '14:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 6', 'MWF', '14:00', '15:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 7', 'MWF', '15:00', '16:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 1', 'TTh',  '08:00', '09:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 2', 'TTh',  '09:00', '10:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 3', 'TTh',  '10:00', '11:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 4', 'TTh',  '11:00', '12:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 5', 'TTh',  '13:00', '14:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 6', 'TTh',  '14:00', '15:00');
INSERT OR IGNORE INTO time_slots (period_name, days, start_time, end_time) VALUES ('Period 7', 'TTh',  '15:00', '16:00');

-- ---------------------------------------------------------------------------
-- 2. Course Sections for the active semester (Fall 2024)
--
-- Assignment strategy (deterministic, conflict-free):
--   - Sections get sequential time slots so no teacher or classroom doubles up.
--   - Teachers are picked round-robin within each specialization.
--   - Classrooms are picked round-robin within the matching room type.
--   - Core courses get 2 sections (A, B); electives get 1 section (A).
-- ---------------------------------------------------------------------------

-- ===== CORE courses (2 sections each) =====

-- ENG101 (English, spec=2, room_type=1/classroom)  — slots 0,1
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG101';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG101';

-- ENG201  — slots 2,3
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG201';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG201';

-- ENG301  — slots 4,5
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG301';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 5),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 5),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 5),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG301';

-- ENG401  — slots 6,7
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 6),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 6),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 6),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG401';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 7),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 7),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 7),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ENG401';

-- MAT101 (Mathematics, spec=1, room_type=1/classroom)  — slots 8,9
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 1 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 8),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 8),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'MAT101';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 1 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 9),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 9),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'MAT101';

-- MAT201  — slots 10,11
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 1 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 10),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 10),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'MAT201';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 1 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 11),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 11),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'MAT201';

-- MAT301  — slots 12,13
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 1 ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 12),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 12),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'MAT301';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 1 ORDER BY id LIMIT 1 OFFSET 5),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 13),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 13),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'MAT301';

-- SCI101 (Science, spec=3, room_type=2/science_lab)  — slots 0,1
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 3 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 2 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SCI101';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 3 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 2 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SCI101';

-- SCI201  — slots 2,3
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 3 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM classrooms WHERE room_type_id = 2 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SCI201';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 3 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM classrooms WHERE room_type_id = 2 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SCI201';

-- SOC101 (Social Studies, spec=4, room_type=1/classroom)  — slots 4,5
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 4 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 14),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SOC101';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 4 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 15),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 5),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SOC101';

-- SOC301  — slots 6,7
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 4 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 16),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 6),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SOC301';

INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'B', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 4 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 17),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 7),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SOC301';

-- ===== ELECTIVE courses (1 section each) =====

-- ART101 (Arts, spec=5, room_type=3/art_studio)  — slot 8
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 5 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 3 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 8),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ART101';

-- ART301  — slot 9
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 5 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 3 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 9),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ART301';

-- PHOT101  — slot 10
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 5 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM classrooms WHERE room_type_id = 3 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 10),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'PHOT101';

-- DRAMA101 (Arts, spec=5)  — slot 11
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 5 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM classrooms WHERE room_type_id = 3 ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 11),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'DRAMA101';

-- MUS101 (Music, spec=6, room_type=6/music_room)  — slot 12
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 6 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 6 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 12),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'MUS101';

-- BAND201 (Music, spec=6)  — slot 13
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 6 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 6 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 13),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'BAND201';

-- CHOIR101 (Music, spec=6)  — slot 0 (wrap)
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 6 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM classrooms WHERE room_type_id = 6 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'CHOIR101';

-- PE101 (PE, spec=7, room_type=4/gym)  — slot 1
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 7 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 4 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'PE101';

-- SPORT101 (PE, spec=7)  — slot 2
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 7 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 4 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SPORT101';

-- CS101 (CS, spec=8, room_type=5/computer_lab)  — slot 3
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 8 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 5 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 3),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'CS101';

-- CS301 (CS, spec=8)  — slot 4
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 8 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 5 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'CS301';

-- SPAN101 (Foreign Language, spec=9, room_type=1/classroom)  — slot 5
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 9 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 18),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 5),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SPAN101';

-- SPAN301 (Foreign Language, spec=9)  — slot 6
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 9 ORDER BY id LIMIT 1 OFFSET 1),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 19),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 6),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'SPAN301';

-- FREN101 (Foreign Language, spec=9)  — slot 7
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 9 ORDER BY id LIMIT 1 OFFSET 2),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 20),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 7),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'FREN101';

-- GERM101 (Foreign Language, spec=9)  — slot 8
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 9 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 21),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 8),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'GERM101';

-- JOURN101 (English, spec=2, room_type=1/classroom)  — slot 9
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 2 ORDER BY id LIMIT 1 OFFSET 0),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 22),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 9),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'JOURN101';

-- PSYCH101 (Social Studies, spec=4, room_type=1/classroom)  — slot 10
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 4 ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM classrooms WHERE room_type_id = 1 ORDER BY id LIMIT 1 OFFSET 23),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 10),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'PSYCH101';

-- ASTRO101 (Science, spec=3, room_type=2/science_lab)  — slot 11
INSERT OR IGNORE INTO course_sections (section_number, course_id, teacher_id, classroom_id, time_slot_id, semester_id, max_capacity)
SELECT 'A', c.id,
       (SELECT id FROM teachers WHERE specialization_id = 3 ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM classrooms WHERE room_type_id = 2 ORDER BY id LIMIT 1 OFFSET 4),
       (SELECT id FROM time_slots ORDER BY id LIMIT 1 OFFSET 11),
       (SELECT id FROM semesters WHERE is_active = 1), 10
FROM courses c WHERE c.code = 'ASTRO101';
