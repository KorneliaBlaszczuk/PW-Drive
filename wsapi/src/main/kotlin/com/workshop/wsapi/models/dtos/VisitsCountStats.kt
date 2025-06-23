package com.workshop.wsapi.models.dtos

import java.time.LocalDate

interface VisitCountStats {
    val count: Long
}

data class VisitCountPerHour(
    val hour: Int,
    override val count: Long
) : VisitCountStats

data class VisitCountPerDay(
    val date: LocalDate,
    override val count: Long
) : VisitCountStats

data class VisitCountPerMonth(
    val month: Int,
    override val count: Long
) : VisitCountStats