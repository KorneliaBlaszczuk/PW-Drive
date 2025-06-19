package com.workshop.wsapi.errors

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(
        ex: MethodArgumentNotValidException,
        request: WebRequest
    ): ResponseEntity<Map<String, Any>> {
        val errors = ex.bindingResult
            .fieldErrors
            .map { fieldError: FieldError ->
                mapOf("field" to fieldError.field, "message" to fieldError.defaultMessage)
            }

        val body = mapOf(
            "status" to HttpStatus.BAD_REQUEST.value(),
            "error" to "Bad Request",
            "message" to "Validation failed",
            "path" to request.getDescription(false).removePrefix("uri="),
            "errors" to errors
        )

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(
        ex: IllegalArgumentException,
        request: WebRequest
    ): ResponseEntity<Map<String, Any>> {
        val body = mapOf(
            "status" to HttpStatus.NOT_FOUND.value(),
            "error" to "Not Found",
            "message" to (ex.message ?: "No message"),
            "path" to request.getDescription(false).removePrefix("uri="),
        )

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body)
    }

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNoSuchElementException(
        ex: NoSuchElementException,
        request: WebRequest
    ): ResponseEntity<Map<String, Any>> {
        val body = mapOf(
            "status" to HttpStatus.NOT_FOUND.value(),
            "error" to "Not Found",
            "message" to (ex.message ?: "No message"),
            "path" to request.getDescription(false).removePrefix("uri="),
        )

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body)
    }

    @ExceptionHandler(NotAnOwnerException::class)
    fun handleNotAnOwner(
        ex: NotAnOwnerException,
        request: WebRequest
    ): ResponseEntity<Map<String, Any>> {
        val body = mapOf(
            "status" to HttpStatus.UNAUTHORIZED.value(),
            "error" to "Unauthorized",
            "message" to (ex.message ?: "No message"),
            "path" to request.getDescription(false).removePrefix("uri="),
        )

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body)
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException::class)
    fun handleTypeMismatchException(
        ex: MethodArgumentTypeMismatchException,
        request: WebRequest
    ): ResponseEntity<Map<String, Any>> {
        val parameterName = ex.name
        val invalidValue = ex.value
        val requiredType = ex.requiredType?.simpleName ?: "unknown"
        
        val message = if (ex.requiredType?.isEnum == true) {
            val enumConstants = ex.requiredType?.enumConstants?.map { it.toString() } ?: emptyList()
            "Invalid value '$invalidValue' for parameter '$parameterName'. Valid values are: ${
                enumConstants.joinToString(
                    ", "
                )
            }"
        } else {
            "Invalid value '$invalidValue' for parameter '$parameterName'. Expected type: $requiredType"
        }

        val body = mapOf(
            "status" to HttpStatus.BAD_REQUEST.value(),
            "error" to "Bad Request",
            "message" to message,
            "path" to request.getDescription(false).removePrefix("uri="),
            "parameter" to parameterName,
            "invalidValue" to (invalidValue ?: "null"),
            "expectedType" to requiredType
        )

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }
}
