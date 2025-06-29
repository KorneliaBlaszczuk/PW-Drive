package com.workshop.wsapi.services

import com.workshop.wsapi.models.*
import com.workshop.wsapi.repositories.HistoryRepository
import com.workshop.wsapi.repositories.RepairRepository
import jakarta.transaction.Transactional
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
    private lateinit var repairRepository: RepairRepository

    @Autowired
    lateinit var emailService: EmailService


    fun getReport(visit: Visit): Raport {
        val repairs = visitService.getRepairs(visit.id!!)
        val mileage = historyRepository.getLatestMileage(visit.car!!.id!!)
        val inspectionDate = historyRepository.getLatestInspectionDate(visit.car!!.id!!)
        return Raport(visit, repairs, mileage, inspectionDate)
    }

    fun addHistory(historyDto: HistoryDto, carId: Long) {
        val car = carService.getCar(carId)
        val history =
            HistoryOfChange(
                historyDto.id,
                car,
                inspectionDate = historyDto.inspectionDate,
                mileage = historyDto.mileage
            )
        historyRepository.save(history)
    }

    @Transactional
    fun updateReport(id: Long, raport: RaportDto, userDetails: UserDetails): Raport {
        val visit = visitService.getVisitById(id)
        val repairs = visitService.getRepairs(id)
        for (rep in raport.repairs) {
            val tempRep = Repair(rep.id, rep.description, rep.price, visit)
            repairRepository.save(tempRep)
        }
        for (rep in repairs) {
            if (!raport.repairs.contains(rep)) {
                repairRepository.delete(rep)
            }
        }

        visitService.saveRaportVisit(id, raport.visit, userDetails)
        raport.inspectionDate?.let {
            addHistory(raport.inspectionDate, raport.visit.car.id)
            raport.visit.car.nextInspection = raport.inspectionDate.inspectionDate?.newValue
        }
        raport.mileage?.let {
            addHistory(raport.mileage, raport.visit.car.id)
            raport.visit.car.mileage = raport.mileage.mileage?.newValue!!
        }

        raport.visit.car.id.let {
            val carRaport = raport.visit.car
            val car = CarDto(
                carRaport.name,
                carRaport.brand,
                carRaport.nextInspection,
                carRaport.model,
                carRaport.year,
                carRaport.mileage
            )
            carService.editCar(
                it,
                car,
                userDetails
            )
        }

        val userName = visit.car?.user?.name ?: ""
        val visitDate = visit.date
        val carName = visit.car?.name ?: ""
        val serviceName = visit.service?.name ?: "Naprawa"

        val userEmail = visit.car?.user?.email

        emailService.sendRaportNotification(
            userName,
            visitDate,
            carName,
            serviceName,
            userEmail!!
        )

        return getReport(visit)
    }
}