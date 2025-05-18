package com.workshop.wsapi.repositories


import com.workshop.wsapi.models.Metadata
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface MetadataRepository : JpaRepository<Metadata, Long> {

}