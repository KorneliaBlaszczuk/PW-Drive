package com.workshop.wsapi.services

import org.springframework.stereotype.Service
import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.VisitDto
import org.springframework.beans.factory.annotation.Autowired
import java.sql.Date
import com.workshop.wsapi.repositories.CarRepository
import com.workshop.wsapi.repositories.ServiceRepository
import com.workshop.wsapi.repositories.VisitRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PathVariable
import java.util.*

@Service
class CarService {
    @Autowired
    lateinit var carRepository: CarRepository

    @Autowired
    lateinit var visitRepository: VisitRepository

    @Autowired
    lateinit var serviceRepository: ServiceRepository

//    fun createCar(name: String, brand: String, model: String, year: Date, mileage: Int, next_inspection: Date, user: Long): Car {
//        return Car()
//    }
    fun getCar(id: Long): Optional<Car> {
        return carRepository.findById(id)
    }
    fun getCarVisits(id:Long): Optional<List<Visit>>{
        return visitRepository.getCarVisits(id)
    }

    fun addCarVisit(visitDto: VisitDto): ResponseEntity<Visit> {
        val car = visitDto.carId?.let {
            carRepository.findById(it).orElseThrow {
                IllegalArgumentException("Car not found with id ${visitDto.carId}")
            }
        }
        val service = visitDto.serviceId?.let {
            serviceRepository.findById(it).orElseThrow {
                IllegalArgumentException("Service not found with id ${visitDto.serviceId}")
            }
        }
        if(service != null && car != null) {
            val newVisit = Visit(service = service, car = car, isReserved = visitDto.isReserved, time = visitDto.time, date = visitDto.date, status =  visitDto.status, comment = visitDto.comment   )
            var savedVisit = visitRepository.save(newVisit)
            return ResponseEntity.ok().body(savedVisit)
        }
        return ResponseEntity(HttpStatus.NOT_ACCEPTABLE)
    }
}