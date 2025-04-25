package com.workshop.wsapi.models

import jakarta.persistence.*
import java.sql.Time
import java.time.DayOfWeek

@Entity
@Table(name = "Opening_Hours")
class OpeningHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hours")
    val id: Long? = null

    @Column(name = "day_of_the_week", columnDefinition = "TEXT")
    @Enumerated(EnumType.STRING)
    val dayOfWeek: DayOfWeek = DayOfWeek.MONDAY

    @Column(name = "is_open", nullable = false)
    val isOpen: Boolean = false

    @Column(name = "open_hour")
    val openHour: Time? = null

    @Column(name = "close_hour")
    val closeHour: Time? = null
}
