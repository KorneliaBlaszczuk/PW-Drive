package com.workshop.wsapi.payload.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size


data class SignUpRequest(
    @field:NotBlank
    @field:Size(min = 3, max = 20)
    val username: String,

    @field:NotBlank
    @field:Size(max = 50)
    @field:Email
    val email: String,
    

    @field:NotBlank
    @field:Size(min = 6, max = 40)
    val password: String,

    @field:NotBlank
    val name: String,

    @field:NotBlank
    val surname: String

)