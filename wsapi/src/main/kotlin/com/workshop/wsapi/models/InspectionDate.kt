package com.workshop.wsapi.models

import com.workshop.wsapi.services.CarService
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDate

@Embeddable
class InspectionDate : History() {

    @Column(name = "old_value")
    val oldValue: LocalDate = LocalDate.of(0, 1, 1)


    @Column(name = "new_value")
    val newValue: LocalDate = LocalDate.of(0, 1, 1)


    override fun accept(id: Long, carService: CarService, userDetails: UserDetails): HistoryOfChange {
        return carService.addHistory(id, this, userDetails)
    }
}