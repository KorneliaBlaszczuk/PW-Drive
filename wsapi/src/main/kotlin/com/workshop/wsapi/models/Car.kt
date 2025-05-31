package com.workshop.wsapi.models

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import java.time.LocalDateTime


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
    var nextInspection: LocalDateTime? = null,

    @OneToMany(mappedBy = "car", orphanRemoval = true)
    @JsonBackReference("car-visit")
    var visits: MutableList<Visit> = mutableListOf()
) {
    constructor(
        user: User,
        name: String,
        brand: String,
        model: String,
        year: Int,
        mileage: Int,
        nextInspection: LocalDateTime?
    ) : this(
        user = user,
        name = name,
        brand = brand,
        model = model,
        year = year,
        mileage = mileage,
        nextInspection = nextInspection,
        visits = mutableListOf()
    )

    constructor(
        id: Long,
        user: User,
        name: String,
        brand: String,
        model: String,
        year: Int,
        mileage: Int,
        nextInspection: LocalDateTime?
    ) : this(
        id = id,
        user = user,
        name = name,
        brand = brand,
        model = model,
        year = year,
        mileage = mileage,
        nextInspection = nextInspection,
        visits = mutableListOf()
    )
}

data class CarDto(
    var name: String,
    var brand: String,
    var nextInspection: LocalDateTime?,
    var model: String,
    var year: Int,
    var mileage: Int
)

