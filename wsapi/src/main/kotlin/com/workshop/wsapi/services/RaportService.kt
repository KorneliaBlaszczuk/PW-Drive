package com.workshop.wsapi.services

import com.workshop.wsapi.models.CarDto
import com.workshop.wsapi.models.Raport
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.repositories.HistoryRepository
import com.workshop.wsapi.repositories.VisitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service

@Service
class RaportService {

    @Autowired
    private lateinit var historyRepository: HistoryRepository

    @Autowired
    private lateinit var visitService: VisitService

    @Autowired
    private lateinit var carService: CarService

    @Autowired
    private lateinit var repairService: RepairService


    @Autowired
    private lateinit var visitRepository: VisitRepository


    fun getReport(visit: Visit): Raport {
        val repairs = visitService.getRepairs(visit.id!!)
        val mileage = historyRepository.getLatestMileage(visit.car!!.id!!)
        val inspectionDate = historyRepository.getLatestInspectionDate(visit.car!!.id!!)
        return Raport(visit, repairs, mileage, inspectionDate)
    }

    fun updateReport(id: Long, raport: Raport, userDetails: UserDetails): Raport {
        for (rep in raport.repairs) {
            visitService.addRepair(id, rep)
        }
        visitRepository.save(raport.visit)
        raport.inspectionDate?.let {
            historyRepository.save(it)
            raport.visit.car?.nextInspection = raport.inspectionDate.inspectionDate?.newValue
        }
        raport.mileage?.let {
            historyRepository.save(it)
            raport.visit.car?.mileage = raport.mileage.mileage?.newValue!!
        }
        raport.visit.car?.id?.let {
            carService.editCar(
                it,
                CarDto(
                    raport.visit.car!!.name,
                    raport.visit.car!!.brand,
                    raport.visit.car?.nextInspection,
                    raport.visit.car!!.model,
                    raport.visit.car!!.year,
                    raport.visit.car!!.mileage
                ),
                userDetails
            )
        }
        val newRaport = getReport(raport.visit)
        return newRaport
    }
}