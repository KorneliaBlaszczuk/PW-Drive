package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.OpeningHour
import com.workshop.wsapi.models.dtos.VisitCountStats
import com.workshop.wsapi.repositories.ServiceRepairsStats
import com.workshop.wsapi.services.DailyServicesRepairsSummaryService
import com.workshop.wsapi.services.OpeningHoursService
import com.workshop.wsapi.services.VisitService
import com.workshop.wsapi.services.VisitsStatsService
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
    lateinit var visitsStatsService: VisitsStatsService

    @Autowired
    lateinit var servicesRepairsSummaryService: DailyServicesRepairsSummaryService

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
    enum class VisitStatsPeriod {
        year,
        month,
        day
    }

    @GetMapping("/stats/visits-count")
    fun getVisitsStats(
        @RequestParam("period") period: VisitStatsPeriod,
        @RequestParam("startDate") startDate: LocalDate
    ): ResponseEntity<List<VisitCountStats>> {
        val stats = when (period) {
            VisitStatsPeriod.year -> visitsStatsService.getVisitsYearStats(startDate.year)
            VisitStatsPeriod.month -> visitsStatsService.getVisitsMonthStats(startDate)
            VisitStatsPeriod.day -> visitsStatsService.getVisitsDayStats(startDate)
        }
        return ResponseEntity.ok(stats)
    }

    @Suppress("EnumEntryName")
    enum class SRStatsPeriod {
        year,
        month,
    }

    @Suppress("EnumEntryName")
    enum class SRStatsCategory {
        service,
        repair,
        all
    }

    @GetMapping("/stats/services-repairs-stats")
    fun getServicesRepairsStats(
        @RequestParam("period") period: SRStatsPeriod,
        @RequestParam("startDate") startDate: LocalDate,
        @RequestParam("category") category: SRStatsCategory = SRStatsCategory.all,
        @RequestParam(required = false) services: List<String>?

    ): ResponseEntity<List<ServiceRepairsStats>> {
        val stats = servicesRepairsSummaryService.getSummary(
            startDate = startDate,
            period = period,
            category = category,
            services = services
        )
        return ResponseEntity.ok(stats)
    }
}

