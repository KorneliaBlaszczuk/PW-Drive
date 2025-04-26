package com.workshop.wsapi.services

import org.springframework.stereotype.Service
import com.workshop.wsapi.models.Car
import org.springframework.beans.factory.annotation.Autowired
import java.sql.Date
import com.workshop.wsapi.repositories.CarRepository
import java.util.*

@Service
class CarService {
    @Autowired
    lateinit var carRepository: CarRepository
    fun createCar(name: String, brand: String, model: String, year: Date, mileage: Int, next_inspection: Date, user: Long): Car {
        return Car()
    }
    fun getCar(id: Long): Optional<Car> {
        return carRepository.findById(id)
    }
}