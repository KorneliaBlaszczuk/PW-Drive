package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.CarDto
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.VisitDto
import com.workshop.wsapi.services.CarService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/cars")
class CarController {

    @Autowired
    lateinit var carService: CarService


    @GetMapping("/{id}")
    fun getCarById(@PathVariable id: Long): Optional<Car> {
        return carService.getCar(id)
    }

    @PutMapping("/{id}")
    fun editCar(
        @PathVariable id: Long,
        @RequestBody @Validated car: CarDto,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Car> {
        return carService.editCar(id, car, userDetails)
    }

    @DeleteMapping("/{id}")
    fun deleteCar(@PathVariable id: Long, @AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Any> {
        return ResponseEntity.ok().body(carService.deleteCar(id, userDetails))
    }

    @GetMapping("{id}/visits")
    fun getCarVisits(@PathVariable id: Long): Optional<List<Visit>> {
        return carService.getCarVisits(id)
    }

    @PostMapping("{id}/visits")
    fun addVisit(@PathVariable id: Long, @RequestBody @Validated visit: VisitDto): ResponseEntity<Visit> {
        return carService.addCarVisit(id, visit)
    }


}