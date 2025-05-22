package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.OpeningHour
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.stereotype.Repository


@Repository
interface OpeningHoursRepository : JpaRepository<OpeningHour, Long> {
    @NativeQuery(
        value = "" +
                "SELECT * FROM OPENING_HOURS ORDER BY " +
                "  CASE day_of_the_week" +
                "    WHEN 'MONDAY' THEN 1" +
                "    WHEN 'TUESDAY' THEN 2" +
                "    WHEN 'WEDNESDAY' THEN 3" +
                "    WHEN 'THURSDAY' THEN 4" +
                "    WHEN 'FRIDAY' THEN 5" +
                "    WHEN 'SATURDAY' THEN 6" +
                "    WHEN 'SUNDAY' THEN 7" +
                "  END;"
    )
    fun getHours(): List<OpeningHour>
}