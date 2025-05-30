package com.workshop.wsapi.services

import com.workshop.wsapi.models.AddServiceDto
import com.workshop.wsapi.models.DeleteOutcome
import com.workshop.wsapi.repositories.ServiceRepository
import com.workshop.wsapi.repositories.VisitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import com.workshop.wsapi.models.Service as ServiceModel


@Service
class ServiceService {

    @Autowired
    lateinit var serviceRepository: ServiceRepository

    @Autowired
    lateinit var visitRepository: VisitRepository


    fun addService(service: AddServiceDto): ServiceModel {
        val newService = ServiceModel(
            service.name!!, service.price!!, service.time
        )
        return serviceRepository.save(newService)
    }

    fun deleteOrDeprecate(id: Long): DeleteOutcome {
        val service = serviceRepository.findById(id).orElseThrow { NoSuchElementException("Service not found") }

        return if (visitRepository.existsByServiceId(id)) {
            val updated = service.copy(isDeprecated = true)
            serviceRepository.save(updated)
            DeleteOutcome.DEPRECATED
        } else {
            serviceRepository.deleteById(id)
            DeleteOutcome.DELETED
        }
    }


    fun getServices(): List<ServiceModel> {
        return serviceRepository.findAllByIsDeprecatedFalse()
    }

}