package com.workshop.wsapi.models

import jakarta.persistence.*
import java.sql.Date

@Entity
@Table(name = "Days_off")
class DayOff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_day_off")
    val id: Long? = null

    @Column(name = "date", nullable = false, unique = true)
    var date: Date? = null
}
