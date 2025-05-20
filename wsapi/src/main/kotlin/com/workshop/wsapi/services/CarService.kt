package com.workshop.wsapi.services

import com.workshop.wsapi.models.*
import com.workshop.wsapi.repositories.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
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

    @Autowired
    lateinit var serviceRepository: ServiceRepository


    @Autowired
    lateinit var historyRepository: HistoryRepository

    @Autowired
    lateinit var repairRepository: RepairRepository

    @Autowired
    lateinit var userService: UserService

    fun getCar(id: Long): Optional<Car> {
        return carRepository.findById(id)
    }


    fun getHistory(id: Long, userDetails: UserDetails): ResponseEntity<Optional<List<HistoryOfChange>>> {
        val car = carRepository.findById(id).orElseThrow {
            IllegalArgumentException("Car not found with id ${id}")
        }
        if (car.user.id != userService.getUserByUsername(userDetails.username).id) {
            ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access history of cars from your own account")
        }
        return ResponseEntity.ok().body(historyRepository.getCarHistory(id))
    }

    fun addHistory(
        id: Long,
        history: InspectionDate,
        userDetails: UserDetails
    ): ResponseEntity<Any> {
        val car = carRepository.findById(id).orElseThrow {
            IllegalArgumentException("Car not found with id $id")
        }
        if (car.user.id != userService.getUserByUsername(userDetails.username).id) {
            ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access history of cars from your own account")
        }
        val newHist = HistoryOfChange(null, car, inspectionDate = history)
        val savedHist = historyRepository.save(newHist)
        return ResponseEntity.ok().body(savedHist)
    }

    fun addHistory(
        id: Long,
        history: Mileage,
        userDetails: UserDetails
    ): ResponseEntity<Any> {
        val car = carRepository.findById(id).orElseThrow {
            IllegalArgumentException("Car not found with id $id")
        }
        if (car.user.id != userService.getUserByUsername(userDetails.username).id) {
            ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access history of cars from your own account")
        }
        val newHist = HistoryOfChange(null, car, mileage = history)
        val savedHist = historyRepository.save(newHist)
        return ResponseEntity.ok().body(savedHist)
    }


    fun editCar(
        id: Long,
        editedCar: CarDto,
        userDetails: UserDetails
    ): ResponseEntity<Car> {
        val oldCar =
            carRepository.findById(id).orElseThrow {
                IllegalArgumentException("Car not found with id $id")

            }
        val user = oldCar.user.id?.let {
            userRepository.findById(it).orElseThrow {
                IllegalArgumentException("User not found with id ${oldCar.user.id}")
            }
        }
        if (user != null) {
            if (user.id == userService.getUserByUsername(userDetails.username).id)
                if (oldCar != null) {
                    val updatedCar = Car(
                        id = oldCar.id,
                        user = user,
                        name = editedCar.name,
                        brand = editedCar.brand,
                        nextInspection = editedCar.nextInspection,
                        model = editedCar.model,
                        year = editedCar.year,
                        mileage = editedCar.mileage
                    )
                    return ResponseEntity.ok().body(carRepository.save(updatedCar))
                }
        }
        return ResponseEntity(HttpStatus.NOT_ACCEPTABLE)
    }

    fun getCarVisits(id: Long): Optional<List<Visit>> {
        return visitRepository.getCarVisits(id)
    }

    fun addCarVisit(id: Long, visitDto: VisitDto): ResponseEntity<Visit> {
        val car =
            carRepository.findById(id).orElseThrow {
                IllegalArgumentException("Car not found with id $id")

            }
        val service = visitDto.serviceId?.let {
            serviceRepository.findById(it).orElseThrow {
                IllegalArgumentException("Service not found with id ${visitDto.serviceId}")
            }
        }
        if (service != null && car != null) {
            val newVisit = Visit(
                service = service,
                car = car,
                isReserved = visitDto.isReserved,
                time = visitDto.time,
                date = visitDto.date,
                status = visitDto.status,
                comment = visitDto.comment
            )
            val savedVisit = visitRepository.save(newVisit)
            return ResponseEntity.ok().body(savedVisit)
        }
        return ResponseEntity(HttpStatus.NOT_ACCEPTABLE)
    }


    fun addCarRepair(id: Long): Repair {
        val oldVisit = visitRepository.findById(id)

        val newRepair = Repair().apply {
            description = ""
            price = 0
            visit = visit
        }

        return repairRepository.save(newRepair)
    }

    fun deleteCar(id: Long, userDetails: UserDetails) {
        val car =
            carRepository.findById(id).orElseThrow {
                IllegalArgumentException("Car not found with id $id")

            }
        if (car == null || car.user.id != userService.getUserByUsername(userDetails.username).id)
            throw IllegalArgumentException("Invalid car id $id")
        return carRepository.deleteById(id)

    }
}