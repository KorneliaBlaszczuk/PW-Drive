package com.workshop.wsapi.controllers

import com.workshop.wsapi.models.Metadata
import com.workshop.wsapi.models.MetadataDTO
import com.workshop.wsapi.models.MetadataInfoDTO
import com.workshop.wsapi.services.MetadataService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/metadata")
class MetadataController {

    @Autowired
    lateinit var metadataService: MetadataService

    @GetMapping("/info")
    fun getCompanyInfo(): ResponseEntity<MetadataInfoDTO> {
        return ResponseEntity.ok().body(metadataService.getMetadataInfo())
    }

    @GetMapping("/info-full")
    fun getFullCompanyInfo(): ResponseEntity<Metadata> {
        return ResponseEntity.ok().body(metadataService.getMetadataFull())
    }

    @PutMapping("/{id}")
    fun editMetadata(
        @PathVariable("id") id: Long,
        @RequestBody @Validated metadata: MetadataDTO,
    ): ResponseEntity<Metadata> {
        val updatedMetadata = metadataService.editMetadata(id, metadata)
        return ResponseEntity.ok().body(updatedMetadata)
    }
}