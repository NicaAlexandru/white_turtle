package com.maplewood.service;

import com.maplewood.enums.EnrollmentStatus;
import com.maplewood.enums.ValidationErrorType;
import com.maplewood.exception.EnrollmentValidationException;
import com.maplewood.model.*;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentCourseHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidationService {

    private static final int MAX_COURSES_PER_SEMESTER = 5;

    private final EnrollmentRepository enrollmentRepository;
    private final StudentCourseHistoryRepository historyRepository;

    /**
     * Runs all 6 enrollment business rules. Throws EnrollmentValidationException on failure.
     */
    public void validateEnrollment(Student student, CourseSection section) {
        Course course = section.getCourse();
        checkNotAlreadyEnrolled(student, course);
        checkNotAlreadyPassed(student, course);
        checkGradeLevel(student, course);
        checkPrerequisite(student, course);
        checkMaxCourses(student);
        checkTimeConflictAndCapacity(student, section);
    }

    private void checkNotAlreadyEnrolled(Student student, Course course) {
        if (enrollmentRepository.isAlreadyEnrolledInCourse(student.getId(), course.getId())) {
            String message = "Already enrolled in " + course.getName() + " (" + course.getCode() + ")";
            throw new EnrollmentValidationException(ValidationErrorType.duplicate, message);
        }
    }

    private void checkNotAlreadyPassed(Student student, Course course) {
        if (historyRepository.hasPassedCourse(student.getId(), course.getId())) {
            String message = "Already passed " + course.getName() + " (" + course.getCode() + ")";
            throw new EnrollmentValidationException(ValidationErrorType.duplicate, message);
        }
    }

    private void checkGradeLevel(Student student, Course course) {
        if (student.getGradeLevel() < course.getGradeLevelMin() ||
            student.getGradeLevel() > course.getGradeLevelMax()) {

            String message = String.format("%s is for grades %d-%d, but student is in grade %d",
                course.getName(), course.getGradeLevelMin(), course.getGradeLevelMax(), student.getGradeLevel());
            throw new EnrollmentValidationException(ValidationErrorType.grade_level, message);
        }
    }

    private void checkPrerequisite(Student student, Course course) {
        if (course.getPrerequisite() != null && 
            !historyRepository.hasPassedCourse(student.getId(), course.getPrerequisite().getId())) {

            Course prereq = course.getPrerequisite();
            String message = String.format("Missing prerequisite: %s (%s) must be passed before enrolling in %s",
                prereq.getName(), prereq.getCode(), course.getName());

            throw new EnrollmentValidationException(ValidationErrorType.prerequisite, message);
        }
    }

    private void checkMaxCourses(Student student) {
        long count = enrollmentRepository.countActiveByStudentId(student.getId());
        if (count >= MAX_COURSES_PER_SEMESTER) {
            String message = String.format("Maximum of %d courses per semester reached (currently enrolled in %d)",
                MAX_COURSES_PER_SEMESTER, count);
            throw new EnrollmentValidationException(ValidationErrorType.max_courses, message);
        }
    }

    private void checkTimeConflictAndCapacity(Student student, CourseSection section) {
        Course course = section.getCourse();
        TimeSlot newSlot = section.getTimeSlot();

        List<Enrollment> current = enrollmentRepository
                .findByStudentIdAndStatusAndSectionSemesterIsActiveTrue(student.getId(), EnrollmentStatus.enrolled);

        for (Enrollment existing : current) {
            TimeSlot existingSlot = existing.getSection().getTimeSlot();
            if (newSlot.conflictsWith(existingSlot)) {
                Course conflicting = existing.getSection().getCourse();
                String message = String.format("Time conflict: %s (%s) conflicts with %s (%s)",
                    course.getName(), newSlot.getDisplayLabel(), conflicting.getName(), existingSlot.getDisplayLabel());
                throw new EnrollmentValidationException(ValidationErrorType.conflict, message);
            }
        }

        long enrolled = enrollmentRepository.countBySectionId(section.getId());
        if (enrolled >= section.getMaxCapacity()) {
            String message = String.format("Section %s-%s is full (%d/%d students)",
                course.getCode(), section.getSectionNumber(), enrolled, section.getMaxCapacity());
            throw new EnrollmentValidationException(ValidationErrorType.capacity, message);
        }
    }
}
