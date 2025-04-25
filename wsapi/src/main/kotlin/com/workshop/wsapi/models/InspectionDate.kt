package com.workshop.wsapi.models

import jakarta.persistence.*
import java.sql.Date

@Embeddable
class InspectionDate(

    @Column(name = "old_value")
    val oldValue: Date = Date(0),

    @Column(name = "new_value")
    val newValue: Date = Date(0)
)