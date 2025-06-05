package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.User
import com.workshop.wsapi.models.Visit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByUsername(username: String): Optional<User>

    fun findByEmail(email: String): Optional<User>

    fun existsByUsername(username: String): Boolean

    fun existsByEmail(email: String): Boolean

    @Query("SELECT v FROM Visit v WHERE v.car.user.id = :id ORDER BY v.date ASC, v.time ASC")
    fun getUserVisits(@Param("id") id: Long): Optional<List<Visit>>

    @Query("SELECT c FROM Car c WHERE c.user.id = :id")
    fun getUserCars(@Param("id") id: Long): Optional<List<Car>>


}