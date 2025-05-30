package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Service
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface ServiceRepository : JpaRepository<Service, Long> {
    fun findAllByIsDeprecatedFalse(): List<Service>

    fun findByIdAndIsDeprecatedFalse(id: Long): Optional<Service>
}