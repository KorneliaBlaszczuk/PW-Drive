package com.workshop.wsapi.models

import io.hypersistence.utils.hibernate.type.interval.PostgreSQLIntervalType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.time.Duration

@Entity

@Table(name = "Services")
data class Service(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_service", nullable = false)
    val id: Long? = null,

    val name: String = "",
    var price: Int = 0,

    @Type(PostgreSQLIntervalType::class)
    @Column(name = "time_in_service", columnDefinition = "interval")
    var time: Duration? = null
) {
    constructor(name: String, price: Int, time: Duration) : this(
        id = null,
        name = name,
        price = price,
        time = time
    )
}

data class ServiceDto(
    val name: String,
    val price: Int,
    val time: Duration,
)
