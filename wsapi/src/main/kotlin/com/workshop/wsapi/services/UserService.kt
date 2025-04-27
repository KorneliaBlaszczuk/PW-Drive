package com.workshop.wsapi.services
import com.workshop.wsapi.models.User
import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.CarDto
import com.workshop.wsapi.repositories.CarRepository
import com.workshop.wsapi.repositories.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.query.Param
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

    fun getUserById(id: Long): Optional<User>{
        return userRepository.findById(id)
    }
    fun addCar(carDto: CarDto) : ResponseEntity<Car> {
        val usr = carDto.user?.let {
            userRepository.findById(it).orElseThrow {
                IllegalArgumentException("User not found with id: ${carDto.user}")
            }
        }
        val newCar = usr?.let {
            Car(
                user = it,
                name = carDto.name ?: "",
                brand = carDto.brand ?: "",
                model = carDto.model ?: "",
                year = carDto.year ?: 0,
                mileage = carDto.mileage ?: 0,
                nextInspection = carDto.nextInspection
            )
        }
        var savedCar = newCar?.let { carRepository.save(it) }
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCar)
    }



}