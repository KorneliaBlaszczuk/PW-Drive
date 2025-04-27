package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.User
import com.workshop.wsapi.models.UserRole
import com.workshop.wsapi.payload.request.LoginRequest
import com.workshop.wsapi.payload.request.SignUpRequest
import com.workshop.wsapi.payload.response.JwtResponse
import com.workshop.wsapi.payload.response.MessageResponse
import com.workshop.wsapi.repositories.UserRepository
import com.workshop.wsapi.security.jwt.JwtUtils
import com.workshop.wsapi.security.services.UserDetailsImpl
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*
import java.util.stream.Collectors


@CrossOrigin(origins = ["*"], maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
class AuthController {
    @Autowired
    lateinit var authenticationManager: AuthenticationManager

    @Autowired
    lateinit var userRepository: UserRepository


    @Autowired
    lateinit var encoder: PasswordEncoder

    @Autowired
    lateinit var jwtUtils: JwtUtils

    @PostMapping("/signin")
    fun authenticateUser(@Valid @RequestBody loginRequest: LoginRequest): ResponseEntity<*> {
        val authentication: Authentication = authenticationManager
            .authenticate(UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password))

        SecurityContextHolder.getContext().authentication = authentication
        val jwt = jwtUtils.generateJwtToken(authentication)

        val userDetails = authentication.principal as UserDetailsImpl
        val roles = userDetails.authorities.stream().map { item: GrantedAuthority -> item.authority }
            .collect(Collectors.toList())

        return ResponseEntity
            .ok(JwtResponse(jwt, userDetails.id!!, userDetails.username, userDetails.email, roles))
    }

    @PostMapping("/signup")
    fun registerUser(@Valid @RequestBody signUpRequest: SignUpRequest): ResponseEntity<*> {

        if (userRepository.existsByUsername(signUpRequest.username)) {
            return ResponseEntity.badRequest().body(MessageResponse("Error: Username is already taken!"))
        }

        if (userRepository.existsByEmail(signUpRequest.email)) {
            return ResponseEntity.badRequest().body(MessageResponse("Error: Email is already in use!"))
        }


        // Create new user's account
        val user = User(
            role = UserRole.USER,
            username = signUpRequest.username,
            email = signUpRequest.email,
            name = signUpRequest.name,
            surname = signUpRequest.surname,
            password = encoder.encode(signUpRequest.password)
        )

        userRepository.save<User>(user)

        return ResponseEntity.ok(MessageResponse("User registered successfully!"))
    }
}