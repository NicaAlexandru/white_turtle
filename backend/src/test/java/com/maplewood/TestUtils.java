package com.maplewood;

import com.maplewood.enums.CourseStatus;
import com.maplewood.enums.CourseType;
import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.enums.SemesterSeason;
import com.maplewood.model.*;

import java.time.LocalDateTime;

public final class TestUtils {

    private TestUtils() {}

    public static Student student(Long id, String first, String last, int grade) {
        Student s = new Student();
        s.setId(id);
        s.setFirstName(first);
        s.setLastName(last);
        s.setGradeLevel(grade);
        s.setEmail(first.toLowerCase() + "." + last.toLowerCase() + "@school.edu");
        s.setEnrollmentYear(2023);
        s.setExpectedGraduationYear(2027);
        s.setStatus("active");
        return s;
    }

    public static Student student() {
        return student(1L, "Alice", "Smith", 10);
    }

    public static Course course(Long id, String code, String name,
                                int gradeMin, int gradeMax, CourseType type) {
        Course c = new Course();
        c.setId(id);
        c.setCode(code);
        c.setName(name);
        c.setCredits(3.0);
        c.setHoursPerWeek(3);
        c.setGradeLevelMin(gradeMin);
        c.setGradeLevelMax(gradeMax);
        c.setCourseType(type);
        c.setSemesterOrder(1);
        return c;
    }

    public static Course course() {
        return course(10L, "ENG101", "English I", 9, 12, CourseType.core);
    }

    public static TimeSlot timeSlot(Long id, String days, String start, String end) {
        TimeSlot ts = new TimeSlot();
        ts.setId(id);
        ts.setPeriodName("Period 1");
        ts.setDays(days);
        ts.setStartTime(start);
        ts.setEndTime(end);
        return ts;
    }

    public static TimeSlot timeSlot() {
        return timeSlot(1L, "MWF", "08:00", "09:00");
    }

    public static Teacher teacher(Long id, String first, String last) {
        Teacher t = new Teacher();
        t.setId(id);
        t.setFirstName(first);
        t.setLastName(last);
        return t;
    }

    public static Teacher teacher() {
        return teacher(1L, "John", "Doe");
    }

    public static Classroom classroom(Long id, String name) {
        Classroom cl = new Classroom();
        cl.setId(id);
        cl.setName(name);
        cl.setCapacity(10);
        return cl;
    }

    public static Classroom classroom() {
        return classroom(1L, "Room 101");
    }

    public static Semester semester(Long id, SemesterSeason season, int year, boolean active) {
        Semester s = new Semester();
        s.setId(id);
        s.setName(season);
        s.setYear(year);
        s.setOrderInYear(season == SemesterSeason.Fall ? 1 : 2);
        s.setIsActive(active);
        return s;
    }

    public static Semester activeSemester() {
        return semester(1L, SemesterSeason.Fall, 2024, true);
    }

    public static CourseSection section(Long id, Course course, TimeSlot slot) {
        CourseSection cs = new CourseSection();
        cs.setId(id);
        cs.setCourse(course);
        cs.setSectionNumber("A");
        cs.setTeacher(teacher());
        cs.setClassroom(classroom());
        cs.setTimeSlot(slot);
        cs.setSemester(activeSemester());
        cs.setMaxCapacity(10);
        return cs;
    }

    public static CourseSection section() {
        return section(100L, course(), timeSlot());
    }

    public static Enrollment enrollment(Long id, Student student, CourseSection section) {
        Enrollment e = new Enrollment();
        e.setId(id);
        e.setStudent(student);
        e.setSection(section);
        e.setStatus(EnrollmentStatus.enrolled);
        e.setEnrolledAt(LocalDateTime.of(2024, 9, 1, 10, 0));
        return e;
    }

    public static Enrollment enrollment() {
        return enrollment(200L, student(), section());
    }

    public static StudentCourseHistory history(Long id, Student student,
                                               Course course, CourseStatus status) {
        StudentCourseHistory h = new StudentCourseHistory();
        h.setId(id);
        h.setStudent(student);
        h.setCourse(course);
        h.setSemester(activeSemester());
        h.setStatus(status);
        return h;
    }
}
