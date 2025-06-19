package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.OpeningHour
import com.workshop.wsapi.models.dtos.VisitCountStats
import com.workshop.wsapi.services.OpeningHoursService
import com.workshop.wsapi.services.StatsService
import com.workshop.wsapi.services.VisitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.time.LocalDate


@RestController
@RequestMapping("/api/admin")
class AdminController {

    @Autowired
    lateinit var visitService: VisitService

    @Autowired
    lateinit var statsService: StatsService

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

    @Suppress("EnumEntryName")
    enum class Period {
        year,
        month,
        day
    }

    @GetMapping("/stats/visits-count")
    fun getVisitsStats(
        @RequestParam("period") period: Period,
        @RequestParam("startDate") startDate: LocalDate
    ): ResponseEntity<List<VisitCountStats>> {
        val stats = when (period) {
            Period.year -> statsService.getVisitsYearStats(startDate.year)
            Period.month -> statsService.getVisitsMonthStats(startDate)
            Period.day -> statsService.getVisitsDayStats(startDate)
        }
        return ResponseEntity.ok(stats)
    }
}

