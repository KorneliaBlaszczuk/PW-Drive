package com.workshop.wsapi.controllers

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/cars")
class CarController {

    @GetMapping("/{id}")
    fun getCarById(@PathVariable id: Int): String {
        return "Getting car by id: $id"
    }
}