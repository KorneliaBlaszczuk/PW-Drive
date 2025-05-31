package com.workshop.wsapi.services

import com.workshop.wsapi.models.Raport
import com.workshop.wsapi.models.Visit
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class RaportService {

    @Autowired
    private lateinit var visitService: VisitService

    @Autowired
    private lateinit var repairService: RepairService

    fun getReport(visit: Visit): Raport {
        val repairs = visitService.getRepairs(visit.id!!)
        return Raport(visit, repairs)
    }
}