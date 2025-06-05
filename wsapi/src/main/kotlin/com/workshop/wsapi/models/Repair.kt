package com.workshop.wsapi.models

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*

@Entity
data class Repair(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "description", columnDefinition = "TEXT")
    var description: String = "",

    var price: Int = 0,

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    @JsonBackReference
    var visit: Visit? = null
)

data class RepairDto(
    val description: String,
    val price: Int,
)