package com.workshop.wsapi.services

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.CarDto
import com.workshop.wsapi.models.User
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.repositories.CarRepository
import com.workshop.wsapi.repositories.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import java.util.*


@Service
class UserService {
    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var carRepository: CarRepository
    fun getUserCars(id: Long): Optional<List<Car>> {
        return userRepository.getUserCars(id)
    }

    fun getUserVisits(id: Long): ResponseEntity<Optional<List<Visit>>> {
        return ResponseEntity.ok().body(userRepository.getUserVisits(id))
    }

    fun getUserById(id: Long): Optional<User> {
        return userRepository.findById(id)
    }

    fun getUserByUsername(username: String): User {
        return userRepository.findByUsername(username)
            .orElseThrow {
                IllegalArgumentException("User Not Found with username: $username")
            }
    }

    fun addCar(id: Long, carDto: CarDto): ResponseEntity<Any> {
        val usr = userRepository.findById(id).orElseThrow {
            IllegalArgumentException("User not found with id: ${id}")
        }

        val newCar =
            Car(
                user = usr,
                name = carDto.name,
                brand = carDto.brand,
                model = carDto.model,
                year = carDto.year,
                mileage = carDto.mileage,
                nextInspection = carDto.nextInspection
            )

        var savedCar = carRepository.save(newCar)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCar)
    }


}