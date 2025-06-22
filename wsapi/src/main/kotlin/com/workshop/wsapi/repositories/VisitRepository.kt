package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.dtos.VisitCountPerDay
import com.workshop.wsapi.models.dtos.VisitCountPerHour
import com.workshop.wsapi.models.dtos.VisitCountPerMonth
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

@Repository
interface VisitRepository : JpaRepository<Visit, Long> {
    @Query("select  v from Visit v where v.car.id = :id")
    fun getCarVisits(@Param("id") id: Long): Optional<List<Visit>>

    @Query(
        value = "SELECT * FROM VISITS v WHERE STATUS = 'upcoming' " +
                "AND v.is_reserved IS FALSE " +
                "AND v.date - CURRENT_DATE <= :days " +
                "AND CURRENT_DATE < v.date " +
                "ORDER BY v.date ASC, v.time ASC",
        nativeQuery = true
    )
    fun getUpcomingVisits(@Param("days") days: Int): Optional<List<Visit>>


    @Query(
        value = "SELECT * FROM VISITS v WHERE v.date between :startDate and :endDate",
        nativeQuery = true
    )
    fun findReservedVisitsBetweenDates(
        @Param("startDate") startDate: LocalDateTime,
        @Param("endDate") endDate: LocalDateTime
    ): List<Visit>

    @Transactional
    @Modifying
    @Query(
        value = "delete from visits where is_reserved = true and created_at < :cutoffTime",
        nativeQuery = true
    )
    fun deleteAbandonedReservations(@Param("cutoffTime") cutoffTime: LocalDateTime)

    fun findAllByCar(car: Car): List<Visit>

    fun deleteAllByCar(car: Car)

    fun existsByServiceId(serviceId: Long): Boolean

    @Query(
        """
    SELECT NEW com.workshop.wsapi.models.dtos.VisitCountPerHour(
        CAST(EXTRACT(hour from v.time) as int),
        COUNT(v)
    )
    FROM Visit v
    WHERE v.date = :date
    GROUP BY EXTRACT(hour from v.time)
    ORDER BY EXTRACT(hour from v.time)
"""
    )
    fun countVisitsPerHour(
        @Param("date") date: LocalDate,
    ): List<VisitCountPerHour>


    @Query(
        """
    SELECT NEW com.workshop.wsapi.models.dtos.VisitCountPerDay(
        v.date,
        COUNT(v)
    )
    FROM Visit v
    WHERE v.date >= :startDate AND v.date < :endDate
    GROUP BY DATE(v.date)
    ORDER BY DATE(v.date)
"""
    )
    fun countVisitsPerDay(
        @Param("startDate") startDate: LocalDate,
        @Param("endDate") endDate: LocalDate
    ): List<VisitCountPerDay>


    @Query(
        """
    SELECT NEW com.workshop.wsapi.models.dtos.VisitCountPerMonth(
        CAST(EXTRACT(MONTH FROM v.date) AS int),
        COUNT(v)
    )
    FROM Visit v
    WHERE v.date >= :startDate AND v.date < :endDate
    GROUP BY EXTRACT(MONTH FROM v.date)
    ORDER BY EXTRACT(MONTH FROM v.date)
"""
    )
    fun countVisitsPerMonth(
        @Param("startDate") startDate: LocalDate,
        @Param("endDate") endDate: LocalDate
    ): List<VisitCountPerMonth>


}