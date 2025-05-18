package com.workshop.wsapi.services

import com.workshop.wsapi.models.Metadata
import com.workshop.wsapi.models.MetadataDTO
import com.workshop.wsapi.models.MetadataInfoDTO
import com.workshop.wsapi.models.toInfoDTO
import com.workshop.wsapi.repositories.MetadataRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class MetadataService {

    @Autowired
    lateinit var metadataRepository: MetadataRepository

    fun getMetadataFull(): Metadata? {
        return metadataRepository.findAll().firstOrNull()
            ?: throw NoSuchElementException("No metadata found")
    }

    fun getMetadataInfo(): MetadataInfoDTO {
        val data = metadataRepository.findAll().firstOrNull()
            ?: throw NoSuchElementException("No metadata found")
        return data.toInfoDTO()
    }

    fun editMetadata(id: Long, metadata: MetadataDTO): Metadata {
        val oldData =
            metadataRepository.findById(id).orElseThrow { IllegalArgumentException("No metadata found") }
        val updatedData = Metadata(
            id = oldData.id,
            companyName = metadata.companyName ?: oldData.companyName,
            address = metadata.address ?: oldData.address,
            simultaneousVisits = metadata.simultaneousVisits ?: oldData.simultaneousVisits,
            email = metadata.email ?: oldData.email,
            phoneNumber = metadata.phoneNumber ?: oldData.phoneNumber,
            description = metadata.description ?: oldData.description
        )
        return metadataRepository.save(updatedData)
    }
}