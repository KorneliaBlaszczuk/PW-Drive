package com.workshop.wsapi.services

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


    fun addService(service: ServiceModel): ResponseEntity<Any> {
        
        val savedService = serviceRepository.save(service)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedService)
    }

    fun deleteService(id: Long): ResponseEntity<Any> {
        return ResponseEntity.status(HttpStatus.OK).body(serviceRepository.deleteById(id))
    }
}