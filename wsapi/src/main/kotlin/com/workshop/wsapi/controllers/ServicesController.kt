package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.AddServiceDto
import com.workshop.wsapi.models.DeleteOutcome
import com.workshop.wsapi.services.ServiceService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import com.workshop.wsapi.models.Service as ServiceModel


@RestController
@RequestMapping("/api/services")
class ServicesController {

    @Autowired
    private lateinit var serviceService: ServiceService

    @GetMapping("")
    fun getServices(): ResponseEntity<List<ServiceModel>> {
        return ResponseEntity.ok().body(serviceService.getServices())
    }

    @GetMapping("/{id}")
    fun getServiceById(@PathVariable id: Int): String {
        return "Getting service for user $id"
    }


    @PostMapping("")
    fun addService(
        @RequestBody @Valid service: AddServiceDto
    ): ResponseEntity<Any> {
        val newService = serviceService.addService(service)
        return ResponseEntity.status(HttpStatus.CREATED).body(newService)
    }


    @DeleteMapping("/{id}")
    fun deleteOrDeprecateService(@PathVariable id: Long): ResponseEntity<String> {
        return when (serviceService.deleteOrDeprecate(id)) {
            DeleteOutcome.DEPRECATED -> ResponseEntity.ok("Service marked as deprecated")
            DeleteOutcome.DELETED -> ResponseEntity.ok("Service deleted")
        }
    }
}