package com.workshop.wsapi.payload.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size


data class SignUpRequest(
    @field:NotBlank(message = "User cannot be blank")
    @field:Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    val username: String,

    @field:NotBlank
    @field:Size(max = 50, message = "Email cannot be longer than 50 characters")
    @field:Email(message = "Must be a valid email address")
    val email: String,


    @field:NotBlank(message = "Password cannot be blank")
    @field:Size(min = 8, max = 120, message = "Password must have at least 8 characters and not more than 120")
    val password: String,

    @field:NotBlank(message = "Name cannot be blank")
    val name: String,

    @field:NotBlank(message = "Surname cannot be blank")
    val surname: String

)