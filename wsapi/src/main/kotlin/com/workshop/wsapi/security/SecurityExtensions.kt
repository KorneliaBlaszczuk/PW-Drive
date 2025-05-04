package com.workshop.wsapi.security

import org.springframework.security.core.userdetails.UserDetails

fun UserDetails.isAdmin(): Boolean {
    return this.authorities.any { it.authority == "WORKSHOP" }
}
