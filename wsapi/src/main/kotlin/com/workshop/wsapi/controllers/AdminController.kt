package com.workshop.wsapi.controllers

import com.workshop.wsapi.security.isAdmin
import com.workshop.wsapi.services.VisitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/admin")
class AdminController {

    @Autowired
    lateinit var visitService: VisitService


    @GetMapping("/visits")
    fun getVisits(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Any> {
        if (!userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only this resource as admin")
        }
        return visitService.getServices()
    }
}