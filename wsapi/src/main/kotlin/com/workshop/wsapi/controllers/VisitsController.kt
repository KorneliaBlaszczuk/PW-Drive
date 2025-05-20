package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.AvailableSlotDTO
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.VisitDto
import com.workshop.wsapi.services.VisitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime


@RestController
@RequestMapping("/api/visits")
class VisitsController {


    @Autowired
    lateinit var visitService: VisitService


    @GetMapping("/{id}")
    fun getVisitById(@PathVariable id: Long): ResponseEntity<Visit> {
        return ResponseEntity.ok(visitService.getVisitById(id))
    }

    @GetMapping("/available")
    fun getAvailableVisits(
        @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) startDate: LocalDateTime,
        @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) endDate: LocalDateTime,
        @RequestParam("serviceId", required = false) serviceId: Long?,
    ): ResponseEntity<List<AvailableSlotDTO>> {
        val availableSlots = visitService.findAvailableSlotsForService(startDate, endDate, serviceId)
        return ResponseEntity.ok(availableSlots)
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
    fun deleteVisit(@PathVariable id: Long): ResponseEntity<Any> {
        return visitService.deleteVisit(id)
    }


}