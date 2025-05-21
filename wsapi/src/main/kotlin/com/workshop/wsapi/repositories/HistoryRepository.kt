package com.workshop.wsapi.repositories

import com.workshop.wsapi.models.HistoryOfChange
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.NativeQuery
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface HistoryRepository : JpaRepository<HistoryOfChange, Long> {
    @NativeQuery(
        value = "" +
                "SELECT * FROM history_of_changes where car_id_car = :id order by change_date desc"
    )
    fun getCarHistory(@Param("id") id: Long): Optional<List<HistoryOfChange>>
}