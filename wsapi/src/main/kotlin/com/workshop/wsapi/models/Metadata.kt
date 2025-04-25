package com.workshop.wsapi.models

import jakarta.persistence.*

@Entity
class Metadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metadata", nullable = false)
    val id: Long? = null

    @Column(name = "company_name")
    val companyName: String = ""

    @Column(name = "simultaneous_number_of_visits")
    val simultaneousVisits: Int = 0

    val address: String = ""
    val email: String = ""

    @Column(name = "phone_number")
    val phoneNumber: String = ""

    val description: String = ""
}