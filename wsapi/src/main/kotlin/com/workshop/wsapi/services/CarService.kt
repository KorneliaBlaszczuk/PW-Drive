package com.workshop.wsapi.services

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.repositories.CarRepository
import com.workshop.wsapi.repositories.VisitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*

@Service
class CarService {
    @Autowired
    lateinit var carRepository: CarRepository

    @Autowired
    lateinit var visitRepository: VisitRepository

    //    fun createCar(name: String, brand: String, model: String, year: Date, mileage: Int, next_inspection: Date, user: Long): Car {
//        return Car()
//    }
    fun getCar(id: Long): Optional<Car> {
        return carRepository.findById(id)
    }

    fun getCarVisits(id: Long): Optional<List<Visit>> {
        return visitRepository.getCarVisits(id)
    }


}