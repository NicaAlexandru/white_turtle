package com.maplewood.exception;

import com.maplewood.enums.ValidationErrorType;
import lombok.Getter;

@Getter
public class EnrollmentValidationException extends RuntimeException {

    private final ValidationErrorType type;

    public EnrollmentValidationException(ValidationErrorType type, String message) {
        super(message);
        this.type = type;
    }
}
