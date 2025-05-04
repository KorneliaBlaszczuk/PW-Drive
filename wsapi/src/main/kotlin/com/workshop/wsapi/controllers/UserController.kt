package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.CarDto
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.security.isAdmin
import com.workshop.wsapi.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController {

    @Autowired
    lateinit var userService: UserService


    @Autowired
    lateinit var carService: CarService
    @GetMapping("/{id}/cars")
    fun getCars(@PathVariable id: Long, @AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Any> {
        val userId = userService.getUserByUsername(userDetails.username).id

        if (userId != id && !userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access cars from your own account")
        }

        val cars = userService.getUserCars(id)

        return ResponseEntity.ok(cars.orElse(emptyList()))
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