package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Repair
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository


@Repository
interface RepairRepository : JpaRepository<Repair, Long> {
    @NativeQuery(
        value = "" +
                "SELECT * FROM REPAIR WHERE " +
                "VISIT_ID_VISIT = :id"
    )
    fun getVisitRepairs(@Param("id") id: Long): List<Repair>
}