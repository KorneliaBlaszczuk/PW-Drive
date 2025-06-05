package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Repair
import com.workshop.wsapi.models.Visit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository


@Repository
interface RepairRepository : JpaRepository<Repair, Long> {
    @Query("select r from Repair r where r.visit.id = :id")
    fun getVisitRepairs(@Param("id") id: Long): List<Repair>

    fun deleteByVisit(visit: Visit)
}