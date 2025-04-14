package com.workshop.wsapi.models

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.sql.Time

@Entity
class Service {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) val id: Long = 0
    val name: String = ""
    var price: Int = 0
    var time: Time = Time(0)
}

