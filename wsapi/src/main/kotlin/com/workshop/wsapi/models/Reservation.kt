package com.workshop.wsapi.models

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.sql.Date
import java.sql.Time
import java.sql.Timestamp

@Entity
@Table(name = "Reservations")
class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reservation", nullable = false)
    val id: Long? = null

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_service", nullable = false)
    var service: Service? = null

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_car", nullable = false)
    var car: Car? = null

    @Column(name = "time", nullable = false)
    var time: Time? = null

    @Column(name = "date", nullable = false)
    var date: Date? = null

    @Column(name = "created_at")
    @CreationTimestamp
    var createdAt: Timestamp? = null
}