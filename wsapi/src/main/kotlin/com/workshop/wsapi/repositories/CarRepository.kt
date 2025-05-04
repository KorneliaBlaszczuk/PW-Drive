package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.Car
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface CarRepository : JpaRepository<Car, Long> {

}