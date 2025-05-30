package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Car
import com.workshop.wsapi.models.User
import com.workshop.wsapi.models.Visit
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
        value = "SELECT v.created_at, v.date, v.is_reserved, v.time, " +
                "v.id_car, v.id_service, v.id_visit, v.comment, v.status " +
                "FROM VISITS v join cars c on (v.id_car = c.id_car) WHERE c.ID_USER = :id " +
                "order by v.date asc, v.time asc"
    )
    fun getUserVisits(@Param("id") id: Long): Optional<List<Visit>>

    @NativeQuery(
        value = "" +
                "SELECT * FROM CARS WHERE ID_USER = :id"
    )
    fun getUserCars(@Param("id") id: Long): Optional<List<Car>>


}