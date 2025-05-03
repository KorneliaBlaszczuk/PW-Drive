package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Visit
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/services/")
class ServicesController {


    @GetMapping("/{id}")
    fun getServiceById(@PathVariable id: Int): String {
        return "Getting service for user $id"
    }

    @PutMapping("/{id}")
    fun editService(@PathVariable id: Int, @RequestBody @Validated service: Visit): String {
        return "Edited service for user $id"
    }

    @DeleteMapping("/{id}")
    fun deleteService(@PathVariable id: Int): String {
        return "Deleted service for user $id"
    }
}