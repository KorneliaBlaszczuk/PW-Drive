package com.workshop.wsapi.payload.request

import jakarta.validation.constraints.NotBlank


data class LoginRequest(
    val username: @NotBlank String,
    val password: @NotBlank String,
)