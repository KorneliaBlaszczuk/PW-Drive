package com.workshop.wsapi.models

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import java.sql.Date


@Entity
@Table(name = "cars")
data class Car(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_car", nullable = false)
    val id: Long? = null,

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    @JsonBackReference
    val user: User,

    var name: String = "",
    var brand: String = "",
    var model: String = "",
    var year: Int = 0,
    var mileage: Int = 0,

    @Column(name = "next_inspection")
    var nextInspection: Date? = null,

    @OneToMany(mappedBy = "car", orphanRemoval = true)
    @JsonManagedReference
    var visits: MutableList<Visit> = mutableListOf()
) {
    constructor(
        user: User,
        name: String,
        brand: String,
        model: String,
        year: Int,
        mileage: Int,
        nextInspection: Date?
    ) : this(
        user = user,
        name = name,
        brand = brand,
        model = model,
        year = year,
        mileage = mileage,
        nextInspection = nextInspection,
        visits = mutableListOf() // Default empty list
    )
}

data class CarDto(
    var id: Long? = null,
    var user: Long? = null,
    var name: String? = null,
    var brand: String? = null,
    var nextInspection: Date? = null,
    var model: String? = null,
    var year: Int? = null,
    var mileage: Int? = null
)

