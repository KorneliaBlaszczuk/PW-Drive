package com.workshop.wsapi.services

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.CarDto
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.VisitDto
import org.springframework.beans.factory.annotation.Autowired
import java.sql.Date
import com.workshop.wsapi.repositories.CarRepository
import com.workshop.wsapi.repositories.ServiceRepository
import com.workshop.wsapi.repositories.UserRepository
import com.workshop.wsapi.repositories.VisitRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class CarService {
    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    lateinit var carRepository: CarRepository

    @Autowired
    lateinit var visitRepository: VisitRepository

    //    fun createCar(name: String, brand: String, model: String, year: Date, mileage: Int, next_inspection: Date, user: Long): Car {
//        return Car()
//    }
    @Autowired
    lateinit var serviceRepository: ServiceRepository

//    fun createCar(name: String, brand: String, model: String, year: Date, mileage: Int, next_inspection: Date, user: Long): Car {
//        return Car()
//    }
    fun getCar(id: Long): Optional<Car> {
        return carRepository.findById(id)
    }

    fun getCarVisits(id: Long): Optional<List<Visit>> {

    fun editCar(@PathVariable id: Long, @RequestBody @Validated edited_car: CarDto): ResponseEntity<Car> {
        val old_car =
            carRepository.findById(id).orElseThrow {
                IllegalArgumentException("Car not found with id ${id}")

            }
        val user = old_car.user.id?.let {
            userRepository.findById(it).orElseThrow{
                IllegalArgumentException("User not found with id ${old_car.user.id}")
            }
        }
        if(old_car != null && user != null){
            val updatedCar = Car(user=user, name=edited_car.name, brand = edited_car.brand, nextInspection = edited_car.nextInspection, model = edited_car.model, year = edited_car.year, mileage = edited_car.mileage)
            return ResponseEntity.ok().body(carRepository.save(updatedCar))
        }
        return ResponseEntity(HttpStatus.NOT_ACCEPTABLE)
    }

    fun getCarVisits(id:Long): Optional<List<Visit>>{
        return visitRepository.getCarVisits(id)
    }

    fun addCarVisit(id: Long, visitDto: VisitDto): ResponseEntity<Visit> {
        val car =
            carRepository.findById(id).orElseThrow {
                IllegalArgumentException("Car not found with id ${id}")

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