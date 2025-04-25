package com.workshop.wsapi.models

import jakarta.persistence.*
import java.sql.Date

@Entity
@Table(name = "History_of_changes")
class HistoryOfChange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_change")
    val id: Long? = null

    @ManyToOne(optional = false)
    val car: Car? = null

    @Column(name = "change_date")
    var changeDate: Date = Date(0)

    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "newValue", column = Column(name = "new_inspection_date")),
        AttributeOverride(name = "oldValue", column = Column(name = "old_inspection_date"))
    )
    var inspectionDate: InspectionDate? = null

    @Embedded
    @AttributeOverrides(
        AttributeOverride(name = "oldValue", column = Column(name = "old_mileage")),
        AttributeOverride(name = "newValue", column = Column(name = "new_mileage"))
    )
    var mileage: Mileage? = null
}






