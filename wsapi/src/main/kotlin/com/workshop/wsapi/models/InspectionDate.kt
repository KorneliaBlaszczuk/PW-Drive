package com.workshop.wsapi.models

import com.workshop.wsapi.services.CarService
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Embeddable
class InspectionDate : History() {

    @Column(name = "old_value")
    val oldValue: LocalDateTime = LocalDateTime.of(LocalDate.of(0, 1, 1), LocalTime.of(0, 0, 0, 0))


    @Column(name = "new_value")
    val newValue: LocalDateTime = LocalDateTime.of(LocalDate.of(0, 1, 1), LocalTime.of(0, 0, 0, 0))


    override fun accept(id: Long, carService: CarService, userDetails: UserDetails): HistoryOfChange {
        return carService.addHistory(id, this, userDetails)
    }
}