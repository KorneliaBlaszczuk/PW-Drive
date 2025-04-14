package com.workshop.wsapi.models

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne

@Entity
class Repair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long = 0
    @ManyToOne
    @JoinColumn(name="id_visit")
    var visit: Visit = Visit()
    var type: String = ""
    var price: Int = 0
}