package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Visit
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/visits")
class VisitsController {

    @GetMapping("/{id}")
    fun getVisitByID(@PathVariable id: Int): String {
        return "Getting visit by id: $id"
    }

    @PutMapping("/{id}")
    fun editVisit(@PathVariable id: Int): String {
        return "Editing visit by id: $id"
    }

    @DeleteMapping("/{id}")
    fun deleteVisit(@PathVariable id: Int): String {
        return "Deleting visit by id: $id"
    }



}