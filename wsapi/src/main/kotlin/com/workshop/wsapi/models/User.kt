package com.workshop.wsapi.models

import jakarta.persistence.*

@Entity
@Table(name = "users")
class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_user", nullable = false)
    val id: Long? = null

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    var cars: MutableList<Car> = mutableListOf()

    var name: String = ""
    var surname: String = ""
    var username: String = ""
    var email: String = ""
    var type: Int = 0
}