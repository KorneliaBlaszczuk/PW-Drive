package com.workshop.wsapi.models

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

@Entity
@Table(name = "Users")
class User(
    @Enumerated(EnumType.STRING)
    var role: UserRole,

    @Column(unique = true)
    @NotBlank
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    var username: String,

    @Column(unique = true)
    @Email(message = "Must be a valid email address")
    @Size(max = 50)
    @NotBlank
    var email: String,

    @Size(min = 8, max = 120, message = "Password must have at least 8 characters and not more than 120")
    @NotBlank(message = "Provide password")
    val password: String,

    @NotBlank(message = "Name cannot be blank")
    var name: String,

    @NotBlank(message = "Surname cannot be blank")
    var surname: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_user", nullable = false)
    val id: Long? = null

//    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
//    var cars: MutableList<Car> = mutableListOf()

}

enum class UserRole {
    USER, WORKSHOP
}