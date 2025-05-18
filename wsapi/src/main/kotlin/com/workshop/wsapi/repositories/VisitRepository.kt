package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Visit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.*

@Repository
interface VisitRepository : JpaRepository<Visit, Long> {
    @NativeQuery(
        value = "" +
                "SELECT * FROM VISITS WHERE ID_CAR = :id"
    )
    fun getCarVisits(@Param("id") id: Long): Optional<List<Visit>>

    @Query(value = "SELECT * FROM VISITS v WHERE v.date between :startDate and :endDate", nativeQuery = true)
    fun findReservedVisitsBetweenDates(
        @Param("startDate") startDate: LocalDateTime,
        @Param("endDate") endDate: LocalDateTime
    ): List<Visit>

    @Transactional
    @Modifying
    @Query(value = "delete from visits where is_reserved = true and created_at < :cutoffTime", nativeQuery = true)
    fun deleteAbandonedReservations(@Param("cutoffTime") cutoffTime: LocalDateTime)

}