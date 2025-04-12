package com.workshop.wsapi.models

import jakarta.persistence.*
import org.hibernate.annotations.CascadeType
import java.sql.Date


@Entity
class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) val id: Long = 0
    @ManyToOne
    @JoinColumn(name = "car_id")
    var user: User = User()
    var name: String = ""
    val brand: String = ""
    val model: String = ""
    val year: Int = 0
    var mileage: Int = 0
    var next_inspection: Date? = null
}