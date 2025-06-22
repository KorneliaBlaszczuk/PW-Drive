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
        println(services)
        return if (services.isNullOrEmpty() && category == SRStatsCategory.all) {
            when (period) {
                SRStatsPeriod.year -> getYearStats(startDate.year)
                SRStatsPeriod.month -> getMonthStats(startDate)
            }
        } else {
            /* TODO add cases for services list and categories */
            listOf<ServiceRepairsRevenue>()
        }
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