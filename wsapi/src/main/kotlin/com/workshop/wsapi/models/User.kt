package com.workshop.wsapi.models

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.CascadeType
@Entity
class User {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) val id: Long = 0
    @OneToMany(mappedBy = "user",cascade = [CascadeType.ALL])
    private var cars: MutableList<Car> = mutableListOf()
    var name: String = ""
    var surname: String = ""
    var username: String = ""
    var email: String = ""
    var type: Int = 0;
}