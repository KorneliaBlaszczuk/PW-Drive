package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.HistoryOfChange
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


@Repository
interface HistoryRepository : JpaRepository<HistoryOfChange, Long> {
}