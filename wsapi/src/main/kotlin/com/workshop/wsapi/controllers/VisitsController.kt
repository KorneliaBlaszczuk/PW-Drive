package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.VisitDto
import com.workshop.wsapi.services.VisitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/visits")
class VisitsController {


    @Autowired
    lateinit var visitService: VisitService


    @GetMapping("/{id}")
    fun getVisitByID(@PathVariable id: Int): String {
        return "Getting visit by id: $id"
    }

    @PutMapping("/{id}")
    fun editVisit(
        @PathVariable id: Long,
        @RequestBody @Validated visit: VisitDto,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        return visitService.editVisit(id, visit, userDetails)
    }

    @DeleteMapping("/{id}")
    fun deleteVisit(@PathVariable id: Int): String {
        return "Deleting visit by id: $id"
    }


}