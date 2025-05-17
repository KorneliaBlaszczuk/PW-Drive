package com.workshop.wsapi.services

import com.workshop.wsapi.models.ServiceDto
import com.workshop.wsapi.repositories.ServiceRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import com.workshop.wsapi.models.Service as ServiceModel


@Service
class ServiceService {

    @Autowired
    lateinit var serviceRepository: ServiceRepository


    fun addService(service: ServiceDto): ResponseEntity<Any> {
        val newService = ServiceModel(
            service.name, service.price, service.time
        )
        val savedService = serviceRepository.save(newService)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedService)
    }

    fun deleteService(id: Long): ResponseEntity<Any> {
        return ResponseEntity.status(HttpStatus.OK).body(serviceRepository.deleteById(id))
    }

    fun editService(id: Long, service: ServiceDto): ResponseEntity<Any> {
        val oldService =
            serviceRepository.findById(id).orElseThrow {
                IllegalArgumentException("Service not found with id ${id}")

            }
        val editedService = ServiceModel(oldService.id, service.name, service.price, service.time)
        return ResponseEntity.status(HttpStatus.OK).body(serviceRepository.save(editedService))
    }

    fun getServices(): ResponseEntity<Any> {
        return ResponseEntity.ok().body(serviceRepository.findAll())
    }
}