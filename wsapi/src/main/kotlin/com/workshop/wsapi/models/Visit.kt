package com.workshop.wsapi.models

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import java.sql.Date
import java.sql.Time


@Entity
class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) val id: Long = 0
    @ManyToOne
    @JoinColumn(name = "id_service")
    val service: Service = Service()
    @OneToOne
    @JoinColumn(name = "id_car")
    val car: Car =  Car()
    @OneToMany(mappedBy = "repair", cascade = [(CascadeType.ALL)])
    private var repairs: MutableList<Repair> = mutableListOf()
    var time: Time = Time(0)
    var date: Date = Date(0)
    var status: String = ""
    var comment: String? = null
}