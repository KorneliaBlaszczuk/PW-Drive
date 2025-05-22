package com.workshop.wsapi.models

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.workshop.wsapi.services.CarService
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Entity
@Table(name = "History_of_changes")
data class HistoryOfChange(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_change")
    val id: Long? = null,

    @ManyToOne(optional = false)
    @JsonBackReference
    val car: Car? = null,

    @Column(name = "change_date")
    @CreationTimestamp
    var changeDate: LocalDateTime = LocalDateTime.of(LocalDate.of(0, 1, 1), LocalTime.of(0, 0, 0, 0)),

    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "newValue", column = Column(name = "new_inspection_date")),
        AttributeOverride(name = "oldValue", column = Column(name = "old_inspection_date"))
    )
    var inspectionDate: InspectionDate? = null,

    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "oldValue", column = Column(name = "old_mileage")),
        AttributeOverride(name = "newValue", column = Column(name = "new_mileage"))
    )
    var mileage: Mileage? = null,
) {}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = InspectionDate::class, name = "inspection"),
    JsonSubTypes.Type(value = Mileage::class, name = "mileage")
)
abstract class History {
    abstract fun accept(id: Long, carService: CarService, userDetails: UserDetails): HistoryOfChange
}










