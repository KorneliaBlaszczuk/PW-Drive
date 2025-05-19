package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.OpeningHour
import com.workshop.wsapi.services.OpeningHoursService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/hours")
class HoursController {

    @Autowired
    lateinit var openingHoursService: OpeningHoursService

    @GetMapping
    fun getHours(): ResponseEntity<List<OpeningHour>> {
        return openingHoursService.getHours()
    }
}