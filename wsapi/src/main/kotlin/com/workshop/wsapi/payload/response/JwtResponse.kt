package com.workshop.wsapi.payload.response

class JwtResponse(
    var accessToken: String,
    var id: Long,
    var username: String,
    var email: String,
    val roles: List<String>
) {
    var tokenType: String = "Bearer"
}