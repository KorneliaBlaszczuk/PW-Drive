package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Visit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface VisitRepository : JpaRepository<Visit, Long> {
    @NativeQuery(
        value = "" +
                "SELECT * FROM VISITS WHERE ID_CAR = :id"
    )
    fun getCarVisits(@Param("id") id: Long): Optional<List<Visit>>

    @NativeQuery(
        value = "" +
                "SELECT * FROM VISITS WHERE STATUS = 'upcoming' AND \"date\" - CURRENT_DATE <= :days and CURRENT_DATE  < \"date\""
    )
    fun getUpcomingVisits(@Param("days") days: Int): Optional<List<Visit>>

}