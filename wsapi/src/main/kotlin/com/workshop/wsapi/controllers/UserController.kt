package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.CarDto
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.services.CarService
import com.workshop.wsapi.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/users")
class UserController {


    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var carService: CarService
    @GetMapping("/{id}/cars")
    fun getCars(@PathVariable id: Long): Optional<List<Car>> {
        return userService.getUserCars(id)
    }

    @PostMapping("/{id}/cars")
    fun addCar(@PathVariable id: Int, @RequestBody @Validated car: CarDto): ResponseEntity<Car> {
        return userService.addCar(car)
    }



    @GetMapping("/{id}/visits")
    fun getVisits(@PathVariable id: Int): String {
        return "Getting visit for user $id"
    }

    @PostMapping("/{id}/visits")
    fun addVisit(@PathVariable id: Int, @RequestBody @Validated visit: Visit): String {
        return "Added visit for user $id"
    }

    @GetMapping("/{id}/repairs")
    fun getRepairs(@PathVariable id: Int): String {
        return "Getting repairs for user $id"
    }

}