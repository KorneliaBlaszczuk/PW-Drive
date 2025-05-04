package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): Optional<User>

    fun findByEmail(email: String): Optional<User>

    fun existsByUsername(username: String): Boolean

    fun existsByEmail(email: String): Boolean

    @NativeQuery(
        value = "" +
                "SELECT * FROM CARS WHERE ID_USER = :id"
    )
    fun getUserCars(@Param("id") id: Long): Optional<List<Car>>


}