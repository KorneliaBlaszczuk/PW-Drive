package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.VisitDto
import com.workshop.wsapi.repositories.CarRepository
import com.workshop.wsapi.repositories.VisitRepository
import com.workshop.wsapi.services.CarService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
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
    fun editCar(@PathVariable id: Int, @RequestBody @Validated car: Car): String {
        return "Car $id updated"
    }

    @DeleteMapping("/{id}")
    fun deleteCar(@PathVariable id: Int): String {
        return "Car $id deleted"
    }

    @GetMapping("{id}/visits")
    fun getCarVisits(@PathVariable id: Long): Optional<List<Visit>> {
        return carService.getCarVisits(id)
    }

    @PostMapping("{id}/visits")
    fun addVisit(@RequestBody @Validated visit: VisitDto): ResponseEntity<Visit> {
        return carService.addCarVisit(visit)
    }


}