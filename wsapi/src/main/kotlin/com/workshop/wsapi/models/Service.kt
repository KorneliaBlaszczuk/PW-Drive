package com.workshop.wsapi.models

import io.hypersistence.utils.hibernate.type.interval.PostgreSQLIntervalType
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
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

    @Column(nullable = false)
    @ColumnDefault("false")
    var isDeprecated: Boolean = false,

    @Type(PostgreSQLIntervalType::class)
    @Column(name = "time_in_service", columnDefinition = "interval", nullable = false)
    var time: Duration
) {
    constructor(name: String, price: Int, time: Duration) : this(
        id = null,
        name = name,
        price = price,
        time = time
    )
}

data class AddServiceDto(
    // name and price nullable for validation message to be displayed
    @field:NotBlank(message = "Name is required")
    val name: String?,
    @field:NotNull(message = "Price is required")
    val price: Int?,
    @field:NotNull(message = "Time is required")
    val time: Duration?,
)

enum class DeleteOutcome {
    DELETED,
    DEPRECATED
}
