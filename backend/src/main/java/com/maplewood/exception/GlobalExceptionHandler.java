package com.maplewood.exception;

import com.maplewood.dto.ValidationErrorDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ValidationErrorDTO> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ValidationErrorDTO("not_found", ex.getMessage()));
    }

    @ExceptionHandler(EnrollmentValidationException.class)
    public ResponseEntity<ValidationErrorDTO> handleEnrollmentValidation(EnrollmentValidationException ex) {
        log.warn("Enrollment validation failed [{}]: {}", ex.getType(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ValidationErrorDTO(ex.getType().name(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorDTO> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                            .getFieldErrors()
                            .stream()
                            .map(e -> e.getField() + ": " + e.getDefaultMessage())
                            .collect(Collectors.joining(", "));
                            
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ValidationErrorDTO("validation", message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ValidationErrorDTO> handleGeneral(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ValidationErrorDTO("other", "An unexpected error occurred"));
    }
}
