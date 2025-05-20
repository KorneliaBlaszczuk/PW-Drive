package com.workshop.wsapi.errors

/**
 * Exception thrown when a user tries to access a resource
 * that they don't own.
 */
class NotAnOwnerException(message: String) : RuntimeException(message)