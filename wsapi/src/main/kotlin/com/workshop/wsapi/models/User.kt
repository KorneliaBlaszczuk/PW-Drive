package com.workshop.wsapi.models

import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Entity
@Table(name = "Users")
class User(
    @Enumerated(EnumType.STRING)
    var role: UserRole,

    @Column(unique = true)
    @NotEmpty
    @Size(max = 20)
    var username: String,

    @Column(unique = true)
    @Email(message = "Must be a valid email address")
    @NotEmpty
    var email: String,

    @Size(min = 8, max = 120, message = "Password must have at least 8 characters")
    @NotEmpty(message = "Provide password")
    @NotNull(message = "Password is required")
    val password: String,

    var name: String,
    var surname: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_user", nullable = false)
    val id: Long? = null

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    var cars: MutableList<Car> = mutableListOf()

}

enum class UserRole {
    USER, WORKSHOP
}