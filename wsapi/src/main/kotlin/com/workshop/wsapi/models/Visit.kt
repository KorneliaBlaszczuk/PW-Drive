package com.workshop.wsapi.models

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import java.sql.Date
import java.sql.Time
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime


@Entity
@Table(name = "Visits")
data class Visit(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_visit", nullable = false)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "id_service", nullable = true)
    val service: Service? = null,

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_car", nullable = false)
    @JsonManagedReference
    var car: Car? = null,

    @CreationTimestamp
    var createdAt: LocalDateTime,

    var isReserved: Boolean = false,

    @Column(nullable = false)
    var time: Time?,

    @Column(nullable = false)
    var date: Date = Date(0),

    @Column(nullable = false)
    var status: String?,

    var comment: String? = null,
) {
    constructor(
        service: Service,
        car: Car,
        isReserved: Boolean,
        time: Time?,
        date: Date,
        status: String?,
        comment: String?
    ) : this(
        id = null,
        service = service,
        car = car,
        createdAt = LocalDateTime.now(),
        isReserved = isReserved,
        time = time,
        date = date,
        status = status,
        comment = comment
    )

    constructor(
        id: Long,
        service: Service?,
        car: Car,
        isReserved: Boolean,
        time: Time,
        date: Date,
        status: String,
        comment: String?
    ) : this(
        id = id,
        service = service,
        car = car,
        createdAt = LocalDateTime.now(),
        isReserved = isReserved,
        time = time,
        date = date,
        status = status,
        comment = comment
    )
}

data class VisitDto(
    val serviceId: Long? = null,
    val isReserved: Boolean,
    val time: Time? = null,
    val date: Date,
    val status: String? = null,
    val comment: String? = null
)

data class AvailableSlotDTO(
    val date: LocalDate,
    val startTime: LocalTime,
    val endTime: LocalTime,
)