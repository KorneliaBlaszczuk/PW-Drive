package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Car
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/cars")
class CarController {

    @GetMapping("/{id}")
    fun getCarById(@PathVariable id: Int): String {
        return "Getting car by id: $id"
    }

    @PutMapping("/{id}")
    fun editCar(@PathVariable id: Int, @RequestBody @Validated car: Car): String {
        return "Car $id updated"
    }

    @DeleteMapping("/{id}")
    fun deleteCar(@PathVariable id: Int): String {
        return "Car $id deleted"
    }
}