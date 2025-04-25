package com.workshop.wsapi.models

import jakarta.persistence.*
import java.sql.Date


@Entity
@Table(name = "Cars")
class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_car", nullable = false)
    val id: Long? = null

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    val user: User? = null

    var name: String = ""
    var brand: String = ""
    var model: String = ""
    var year: Int = 0
    var mileage: Int = 0

    @Column(name = "next_inspection")
    var nextInspection: Date? = null

    @OneToMany(mappedBy = "car", orphanRemoval = true)
    var reservations: MutableList<Reservation> = mutableListOf()
}

