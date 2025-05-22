package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.OpeningHour
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OpeningHourRepository : JpaRepository<OpeningHour, Long> {
}