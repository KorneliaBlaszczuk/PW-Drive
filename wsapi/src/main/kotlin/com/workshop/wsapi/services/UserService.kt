package com.workshop.wsapi.services

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.repositories.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*


@Service
class UserService {
    @Autowired
    lateinit var userRepository: UserRepository
    fun getUserCars(id: Long): Optional<List<Car>> {
        return userRepository.getUserCars(id)
    }
}