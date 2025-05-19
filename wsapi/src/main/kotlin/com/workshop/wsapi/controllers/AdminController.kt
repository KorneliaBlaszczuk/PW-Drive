package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.OpeningHour
import com.workshop.wsapi.security.isAdmin
import com.workshop.wsapi.services.OpeningHoursService
import com.workshop.wsapi.services.VisitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/admin")
class AdminController {

    @Autowired
    lateinit var visitService: VisitService

    @Autowired
    lateinit var openingService: OpeningHoursService

    @GetMapping("/visits")
    fun getVisits(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Any> {
        if (!userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only this resource as admin")
        }
        return visitService.getVisits()
    }

    @GetMapping("/visits/upcoming/{days}")
    fun getUpcomingVisits(
        @PathVariable days: Int,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        if (!userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only this resource as admin")
        }
        return visitService.getUpcomingVisits(days)
    }

    @PutMapping("/hours")
    fun updateOpeningHours(
        @RequestBody @Validated openingHour: OpeningHour,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        if (!userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only this resource as admin")
        }
        return openingService.editOpeningHours(openingHour)
    }
}