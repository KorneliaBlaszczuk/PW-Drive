package com.workshop.wsapi.services

import com.workshop.wsapi.controllers.AdminController.SRStatsCategory
import com.workshop.wsapi.controllers.AdminController.SRStatsPeriod
import com.workshop.wsapi.repositories.DailyServicesRepairsSummaryRepository
import com.workshop.wsapi.repositories.ServiceRepairsStats
import com.workshop.wsapi.repositories.ServicesRepairsDayStatsDto
import com.workshop.wsapi.repositories.ServicesRepairsMonthStatsDto
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate


@Service
class DailyServicesRepairsSummaryService {
    @Autowired
    lateinit var repository: DailyServicesRepairsSummaryRepository


    fun getNames(): List<String> {
        return repository.getNames()
    }

    fun getSummary(
        startDate: LocalDate,
        period: SRStatsPeriod,
        category: SRStatsCategory,
        services: List<String>? = null
    ): List<ServiceRepairsStats> {

        when (category) {
            SRStatsCategory.service ->
                return when (period) {
                    SRStatsPeriod.year -> getYearStatsServices(startDate.year, services)
                    SRStatsPeriod.month -> getMonthStatsServices(startDate, services)
                }

            SRStatsCategory.repair ->
                return when (period) {
                    SRStatsPeriod.year -> getYearStatsRepairs(startDate.year, services)
                    SRStatsPeriod.month -> getMonthStatsRepairs(startDate, services)
                }

            SRStatsCategory.all ->
                return when (period) {
                    SRStatsPeriod.year -> getYearStatsAny(startDate.year, services)
                    SRStatsPeriod.month -> getMonthStatsAny(startDate, services)
                }
        }
    }

    fun getMonthStatsServices(startDate: LocalDate, services: List<String>?): List<ServicesRepairsDayStatsDto> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats = repository.getStatsPerDayForCategoryServices(
            monthStart,
            monthStart.plusMonths(1), services
        )
        return stats
    }

    fun getMonthStatsRepairs(startDate: LocalDate, services: List<String>?): List<ServicesRepairsDayStatsDto> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats = repository.getStatsPerDayForCategoryRepairs(
            monthStart,
            monthStart.plusMonths(1), services
        )
        return stats
    }

    fun getMonthStatsAny(startDate: LocalDate, services: List<String>?): List<ServicesRepairsDayStatsDto> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats = repository.getStatsPerDayForCategoryAny(
            monthStart,
            monthStart.plusMonths(1), services
        )
        return stats
    }

    fun getYearStatsAny(year: Int, services: List<String>?): List<ServicesRepairsMonthStatsDto> {
        return repository.getStatsPerMonthForCategoryAny(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1), services
        )
    }

    fun getYearStatsRepairs(year: Int, services: List<String>?): List<ServicesRepairsMonthStatsDto> {
        return repository.getStatsPerMonthForCategoryRepairs(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1), services
        )
    }


    fun getYearStatsServices(year: Int, services: List<String>?): List<ServicesRepairsMonthStatsDto> {
        return repository.getStatsPerMonthForCategoryServices(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1), services
        )
    }
}