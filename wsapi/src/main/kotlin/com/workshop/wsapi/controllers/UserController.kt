package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.Visit
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