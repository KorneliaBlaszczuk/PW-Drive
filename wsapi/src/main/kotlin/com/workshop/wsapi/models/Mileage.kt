package com.workshop.wsapi.models

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
class Mileage(
    @Column(name = "old_value")
    val oldValue: Int = 0,

    @Column(name = "new_value")
    val newValue: Int = 0
)