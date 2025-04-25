package com.workshop.wsapi.models

import jakarta.persistence.*

@Embeddable
@Table(name = "Mileage")
class Mileage (

    @Column(name = "old_value")
    val oldValue: Int = 0,

    @Column(name = "new_value")
    val newValue: Int = 0
)