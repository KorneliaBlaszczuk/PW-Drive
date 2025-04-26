package com.workshop.wsapi.models

import jakarta.persistence.*

@Entity
class Repair {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null

    var description: String = ""
    var price: Int = 0

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    var visit: Visit? = null
}