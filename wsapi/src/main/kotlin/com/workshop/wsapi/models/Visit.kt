package com.workshop.wsapi.models

import com.fasterxml.jackson.annotation.JsonBackReference
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.sql.Date
import java.sql.Time


@Entity
@Table(name = "Visits")
data class Visit (
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_visit", nullable = false)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "id_service")
    val service: Service = Service(),

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_car", nullable = false)
    @JsonBackReference
    var car: Car? = null,

    @CreationTimestamp
    var createdAt: Date = Date(0),
    var isReserved: Boolean = false,
    var time: Time = Time(0),
    var date: Date = Date(0),
    var status: String = "",
    var comment: String? = null,
    ){
    constructor(service: Service, car: Car, isReserved: Boolean, time: Time, date: Date, status: String, comment: String?) : this(
        id = null,
        service = service,
        car = car,
        createdAt = Date(System.currentTimeMillis()),
        isReserved = isReserved,
        time = time,
        date = date,
        status = status,
        comment = comment
    )
}

data class VisitDto(
    val carId: Long,
    val serviceId: Long,
    val isReserved: Boolean,
    val time: Time,
    val date: Date,
    val status: String,
    val comment: String
)