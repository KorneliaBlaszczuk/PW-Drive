package com.workshop.wsapi.models

import jakarta.persistence.*

@Entity
class Metadata(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metadata", nullable = false)
    val id: Long? = null,

    @Column(name = "company_name")
    val companyName: String = "",

    @Column(name = "simultaneous_number_of_visits")
    val simultaneousVisits: Int = 0,

    val address: String = "",
    val email: String = "",

    @Column(name = "phone_number")
    val phoneNumber: String = "",

    @Column(name = "description", columnDefinition = "TEXT")
    val description: String = ""
)

data class MetadataDTO(
    val companyName: String? = null,
    val address: String? = null,
    val simultaneousVisits: Int? = null,
    val email: String? = null,
    val phoneNumber: String? = null,
    val description: String? = null,
)

data class MetadataInfoDTO(
    val companyName: String,
    val address: String,
    val email: String,
    val phoneNumber: String,
    val description: String,
)

fun Metadata.toInfoDTO(): MetadataInfoDTO {
    return MetadataInfoDTO(
        companyName = this.companyName,
        address = this.address,
        email = this.email,
        phoneNumber = this.phoneNumber,
        description = this.description
    )
}




