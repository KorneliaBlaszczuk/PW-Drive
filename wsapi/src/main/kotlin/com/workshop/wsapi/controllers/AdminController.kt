package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.OpeningHour
import com.workshop.wsapi.services.OpeningHoursService
import com.workshop.wsapi.services.VisitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
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
    fun getVisits(): ResponseEntity<Any> {
        return visitService.getVisits()
    }

    @GetMapping("/visits/upcoming")
    fun getUpcomingVisits(
        @RequestParam("days") days: Int,
    ): ResponseEntity<Any> {
        return visitService.getUpcomingVisits(days)
    }

    @PutMapping("/hours")
    fun updateOpeningHours(
        @RequestBody @Validated openingHour: OpeningHour,
    ): ResponseEntity<Any> {
        return openingService.editOpeningHours(openingHour)
    }
}