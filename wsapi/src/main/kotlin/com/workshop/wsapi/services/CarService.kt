package com.workshop.wsapi.services

import com.workshop.wsapi.errors.NotAnOwnerException
import com.workshop.wsapi.models.*
import com.workshop.wsapi.repositories.*
import com.workshop.wsapi.security.isAdmin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*

@Service
class CarService {
    @Autowired
    private lateinit var visitService: VisitService

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

    fun isCarOwner(carId: Long, userDetails: UserDetails) {
        val car = getCar(carId)
        if (car.user.id != userService.getUserByUsername(userDetails.username).id && !userDetails.isAdmin()
        ) {
            throw NotAnOwnerException("You can only access your own cars")
        }
    }

    fun getCarDto(id: Long): CarDto {
        val car = carRepository.findById(id).orElseThrow {
            IllegalArgumentException("Car not found with id $id")
        }
        val carDto = CarDto(car.name, car.brand, car.nextInspection, car.model, car.year, car.mileage)
        return carDto
    }

    fun getCar(id: Long): Car {
        val car = carRepository.findById(id).orElseThrow {
            IllegalArgumentException("Car not found with id $id")
        }
        return car
    }

    fun getHistory(id: Long, userDetails: UserDetails): Optional<List<HistoryOfChange>> {
        isCarOwner(id, userDetails)
        return historyRepository.getCarHistory(id)
    }

    fun addHistory(
        id: Long,
        history: InspectionDate,
        userDetails: UserDetails
    ): HistoryOfChange {
        val car = getCar(id)
        isCarOwner(id, userDetails)
        val newHist = HistoryOfChange(null, car, inspectionDate = history)
        val savedHist = historyRepository.save(newHist)
        return savedHist
    }

    fun addHistory(
        id: Long,
        history: Mileage,
        userDetails: UserDetails
    ): HistoryOfChange {
        val car = getCar(id)
        isCarOwner(id, userDetails)
        val newHist = HistoryOfChange(null, car, mileage = history)
        val savedHist = historyRepository.save(newHist)
        return savedHist
    }


    fun editCar(
        id: Long,
        editedCar: CarDto,
        userDetails: UserDetails
    ): Car? {
        isCarOwner(id, userDetails)

        val existingCar = getCar(id)


        existingCar.name = editedCar.name
        existingCar.brand = editedCar.brand
        existingCar.nextInspection = editedCar.nextInspection
        existingCar.model = editedCar.model
        existingCar.year = editedCar.year
        existingCar.mileage = editedCar.mileage

        return carRepository.save(existingCar)
    }

    fun getCarVisits(id: Long): Optional<List<Visit>> {
        return visitRepository.getCarVisits(id)
    }


    fun addCarVisitWithService(id: Long, visitDto: ServiceVisitDTO, userDetails: UserDetails): Visit? {
        isCarOwner(id, userDetails)
        val car = getCar(id)
        val service = visitDto.serviceId.let {
            serviceRepository.findById(it).orElseThrow {
                IllegalArgumentException("Service not found with id ${visitDto.serviceId}")
            }
        }

        if (!visitService.isVisitPossible(visitDto, service)) {
            return null
        }

        val newVisit = Visit(
            service = service,
            car = car,
            isReserved = false,
            time = visitDto.time,
            date = visitDto.date,
            status = null,
            comment = null
        )
        val savedVisit = visitRepository.save(newVisit)
        return savedVisit
    }

    fun addCarVisitNoService(id: Long, visitDto: NoServiceVisitDTO, userDetails: UserDetails): Visit? {

        isCarOwner(id, userDetails)

        val car = getCar(id)
        if (!visitService.isVisitPossible(visitDto)) {
            return null
        }

        val newVisit = Visit(
            service = null,
            car = car,
            isReserved = false,
            time = visitDto.time,
            date = visitDto.date,
            status = null,
            comment = null
        )
        val savedVisit = visitRepository.save(newVisit)
        return savedVisit
    }


    fun deleteCar(id: Long, userDetails: UserDetails) {
        isCarOwner(id, userDetails)
        val car =
            carRepository.findById(id).orElseThrow {
                IllegalArgumentException("Car not found with id $id")

            }
        if (car == null)
            throw IllegalArgumentException("Invalid car id $id")
        return carRepository.deleteById(id)

    }
}