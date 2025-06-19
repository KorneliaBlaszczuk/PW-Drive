package com.workshop.wsapi.services

import com.workshop.wsapi.models.dtos.VisitCountPerDay
import com.workshop.wsapi.models.dtos.VisitCountPerHour
import com.workshop.wsapi.models.dtos.VisitCountPerMonth
import com.workshop.wsapi.repositories.VisitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class StatsService {
    @Autowired
    lateinit var visitRepository: VisitRepository

    fun getVisitsYearStats(year: Int): List<VisitCountPerMonth> {
        val stats = visitRepository.countVisitsPerMonth(
            LocalDate.of(year, 1, 1),
            LocalDate.of(year + 1, 1, 1)
        )
        return stats
    }

    fun getVisitsMonthStats(startDate: LocalDate): List<VisitCountPerDay> {
        val monthStart = LocalDate.of(startDate.year, startDate.month, 1)
        val stats =
            visitRepository.countVisitsPerDay(
                monthStart,
                monthStart.plusMonths(1)
            )
        return stats
    }

    fun getVisitsDayStats(date: LocalDate): List<VisitCountPerHour> {
        val stats = visitRepository.countVisitsPerHour(date)
        return stats
    }
}