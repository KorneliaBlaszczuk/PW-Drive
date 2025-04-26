package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Car
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController {

    @GetMapping("/{id}/cars")
    fun getCars(@PathVariable id: Int): String {
        return "Getting cars for user with: $id"
    }

    @PostMapping("/{id}/cars")
    fun addCar(@PathVariable id: Int, @RequestBody @Validated car: Car): String {
        return "Added car $car for user $id"
    }
}