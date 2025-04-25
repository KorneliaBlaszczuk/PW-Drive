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
    @PostMapping("/add")
    fun addCar(@RequestBody @Validated car: Car): String {
        return "Car Added"
    }
    @GetMapping("/{user_id}")
    fun getUserCars(@PathVariable user_id: Int): String {
        return "Getting cars: $user_id"
    }
    @PutMapping("/{id}/change")
    fun changeCar(@PathVariable id: Int, @RequestBody @Validated car: Car): String {
        return "Car Updated"
    }
}