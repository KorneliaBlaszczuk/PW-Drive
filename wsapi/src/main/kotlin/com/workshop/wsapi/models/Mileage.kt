package com.workshop.wsapi.models

import com.workshop.wsapi.services.CarService
import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.Table
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails

@Embeddable
@Table(name = "Mileage")
class Mileage : History() {

    @Column(name = "old_value")
    val oldValue: Int = 0

    @Column(name = "new_value")
    val newValue: Int = 0

    override fun accept(id: Long, carService: CarService, userDetails: UserDetails): ResponseEntity<Any> {
        return carService.addHistory(id, this, userDetails)
    }
}