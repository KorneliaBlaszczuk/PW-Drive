package com.workshop.wsapi.services

import com.workshop.wsapi.controllers.AdminController.SRStatsCategory
import com.workshop.wsapi.controllers.AdminController.SRStatsPeriod
import com.workshop.wsapi.repositories.DailyServicesRepairsSummaryRepository
import com.workshop.wsapi.repositories.ServiceRepairsRevenue
import com.workshop.wsapi.repositories.ServicesRepairsDayRevenueDto
import com.workshop.wsapi.repositories.ServicesRepairsMonthRevenueDto
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate


@Service
class DailyServicesRepairsSummaryService {
    @Autowired
    lateinit var repository: DailyServicesRepairsSummaryRepository

    fun getSummary(
        startDate: LocalDate,
        period: SRStatsPeriod,
        category: SRStatsCategory,
        services: List<String>? = null
    ): List<ServiceRepairsRevenue> {
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

    fun getMonthStatsServices(startDate: LocalDate, services: List<String>?): List<ServicesRepairsDayRevenueDto> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats = repository.getRevenuePerDayForCategoryServices(
            monthStart,
            monthStart.plusMonths(1), services
        )
        return stats
    }

    fun getMonthStatsRepairs(startDate: LocalDate, services: List<String>?): List<ServicesRepairsDayRevenueDto> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats = repository.getRevenuePerDayForCategoryRepairs(
            monthStart,
            monthStart.plusMonths(1), services
        )
        return stats
    }

    fun getMonthStatsAny(startDate: LocalDate, services: List<String>?): List<ServicesRepairsDayRevenueDto> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats = repository.getRevenuePerDayForCategoryAny(
            monthStart,
            monthStart.plusMonths(1), services
        )
        return stats
    }

    fun getYearStatsAny(year: Int, services: List<String>?): List<ServicesRepairsMonthRevenueDto> {
        return repository.getRevenuePerMonthForCategoryAny(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1), services
        )
    }

    fun getYearStatsRepairs(year: Int, services: List<String>?): List<ServicesRepairsMonthRevenueDto> {
        return repository.getRevenuePerMonthForCategoryRepairs(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1), services
        )
    }


    fun getYearStatsServices(year: Int, services: List<String>?): List<ServicesRepairsMonthRevenueDto> {
        return repository.getRevenuePerMonthForCategoryServices(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1), services
        )
    }

    fun getYearStats(year: Int): List<ServicesRepairsMonthRevenueDto> {
        return repository.getRevenuePerMonth(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1),
        )
    }

    fun getMonthStats(startDate: LocalDate): List<ServicesRepairsDayRevenueDto> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats = repository.getRevenuePerDay(
            monthStart,
            monthStart.plusMonths(1)
        )
        return stats
    }
}