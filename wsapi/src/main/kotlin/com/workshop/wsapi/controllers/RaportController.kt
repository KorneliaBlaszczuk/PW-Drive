package com.workshop.wsapi.controllers

import com.workshop.wsapi.security.isAdmin
import com.workshop.wsapi.services.RaportService
import com.workshop.wsapi.services.UserService
import com.workshop.wsapi.services.VisitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/raport")
class RaportController {

    @Autowired
    private lateinit var raportService: RaportService

    @Autowired
    private lateinit var visitService: VisitService

    @Autowired
    private lateinit var userService: UserService

    @GetMapping("/{id}")
    fun getReportForVisit(
        @PathVariable id: Long,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        val userId = userService.getUserByUsername(userDetails.username).id
        val visit = visitService.getVisitById(id)
        if (userId != visit.car!!.user.id && !userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access cars from your own account")
        }

        return ResponseEntity.ok().body(raportService.getReport(visit))
    }
}