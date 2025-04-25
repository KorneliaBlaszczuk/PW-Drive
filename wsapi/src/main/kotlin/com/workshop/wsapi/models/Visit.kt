package com.workshop.wsapi.models

import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.sql.Date
import java.sql.Time


@Entity
@Table(name = "Visits")
class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_visit", nullable = false)
    val id: Long? = null

    @ManyToOne
    @JoinColumn(name = "id_service")
    val service: Service = Service()

    @ManyToOne(optional = false)
    var car: Car? = null
    @CreationTimestamp
    var createdAt: Date = Date(0)
    var isReserved: Boolean = false
    var time: Time = Time(0)
    var date: Date = Date(0)
    var status: String = ""
    var comment: String? = null
}