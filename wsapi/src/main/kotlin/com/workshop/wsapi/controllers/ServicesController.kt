package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.ServiceDto
import com.workshop.wsapi.security.isAdmin
import com.workshop.wsapi.services.ServiceService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/services")
class ServicesController {

    @Autowired
    private lateinit var serviceService: ServiceService

    @GetMapping("")
    fun getServices(): ResponseEntity<Any> {
        return serviceService.getServices()
    }

    @GetMapping("/{id}")
    fun getServiceById(@PathVariable id: Int): String {
        return "Getting service for user $id"
    }

    @PutMapping("/{id}")
    fun editService(
        @PathVariable id: Long,
        @RequestBody @Validated service: ServiceDto,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        if (!userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access this resource from an Admin Account")
        }


        return serviceService.editService(id, service)
    }

    @PostMapping("")
    fun addService(
        @RequestBody @Validated service: ServiceDto,
        @AuthenticationPrincipal userDetails: UserDetails
    ): ResponseEntity<Any> {
        if (!userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access this resource from an Admin Account")
        }
        return serviceService.addService(service)
    }


    @DeleteMapping("/{id}")
    fun deleteService(@PathVariable id: Long, @AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<Any> {
        if (!userDetails.isAdmin()) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access this resource from an Admin Account")
        }
        return serviceService.deleteService(id)
    }
}