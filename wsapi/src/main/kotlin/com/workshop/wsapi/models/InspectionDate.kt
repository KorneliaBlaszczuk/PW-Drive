package com.workshop.wsapi.models

import com.workshop.wsapi.services.CarService
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
import java.sql.Date

@Embeddable
class InspectionDate : History() {

    @Column(name = "old_value")
    val oldValue: Date = Date(0)

    @Column(name = "new_value")
    val newValue: Date = Date(0)

    override fun accept(id: Long, carService: CarService, userDetails: UserDetails): ResponseEntity<Any> {
        return carService.addHistory(id, this, userDetails)
    }
}