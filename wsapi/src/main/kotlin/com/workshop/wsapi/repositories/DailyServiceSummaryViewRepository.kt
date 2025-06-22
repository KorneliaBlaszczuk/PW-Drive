package com.workshop.wsapi.repositories

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.persistence.Query
import org.springframework.stereotype.Repository
import java.sql.Date
import java.time.LocalDate

interface ServiceRepairsStats {
    val name: String
    val revenue: Int
    val quantity: Int
}

data class ServicesRepairsDayStatsDto(
    override val name: String,
    val date: LocalDate,
    override val revenue: Int,
    override val quantity: Int
) : ServiceRepairsStats

data class ServicesRepairsMonthStatsDto(
    override val name: String,
    val month: Int,
    override val revenue: Int,
    override val quantity: Int
) : ServiceRepairsStats

@Repository
class DailyServicesRepairsSummaryRepository {

    @PersistenceContext
    private lateinit var entityManager: EntityManager

    fun getNames(): List<String> {
        val query = entityManager.createNativeQuery("SELECT distinct name from daily_services_repairs_summary")
        return query.resultList.map { it.toString() }
    }

    fun getStatsPerDayForCategoryServices(
        startDate: LocalDate,
        endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsDayStatsDto> {
        val query: Query
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME not like 'Naprawa:%'
            group by name, date 
            order by date
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME not like 'Naprawa:%' AND name in (:names)
            group by name, date 
            order by date
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        if (!names.isNullOrEmpty()) {
            query.setParameter("names", names)
        }
        return query.resultList.map { mapToDayStatsDto(it as Array<*>) }
    }

    fun getStatsPerDayForCategoryRepairs(
        startDate: LocalDate,
        endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsDayStatsDto> {
        val query: Query
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME like 'Naprawa:%'
            group by name, date 
            order by date
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME like 'Naprawa:%' AND name in (:names)
            group by name, date 
            order by date
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        if (!names.isNullOrEmpty()) {
            query.setParameter("names", names)
        }
        return query.resultList.map { mapToDayStatsDto(it as Array<*>) }
    }

    fun getStatsPerDayForCategoryAny(
        startDate: LocalDate,
        endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsDayStatsDto> {
        val query: Query
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate
            group by name, date 
            order by date
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate  AND name in (:names)
            group by name, date 
            order by date
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        if (!names.isNullOrEmpty()) {
            query.setParameter("names", names)
        }
        return query.resultList.map { mapToDayStatsDto(it as Array<*>) }
    }


    fun getStatsPerMonthForCategoryServices(
        startDate: LocalDate, endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsMonthStatsDto> {
        val query: Query
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name not like 'Naprawa:%'
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name not like 'Naprawa:%' AND name in (:names)
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        if (!names.isNullOrEmpty()) {
            query.setParameter("names", names)
        }

        return query.resultList.map { mapToMonthStatsDto(it as Array<*>) }
    }


    fun getStatsPerMonthForCategoryRepairs(
        startDate: LocalDate, endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsMonthStatsDto> {
        val query: Query
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name like 'Naprawa:%'
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name like 'Naprawa:%' AND name in (:names)
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        if (!names.isNullOrEmpty()) {
            query.setParameter("names", names)
        }
        return query.resultList.map { mapToMonthStatsDto(it as Array<*>) }
    }

    fun getStatsPerMonthForCategoryAny(
        startDate: LocalDate, endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsMonthStatsDto> {
        val query: Query
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate 
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int), cast(sum(quantity) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name in (:names)
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        if (!names.isNullOrEmpty()) {
            query.setParameter("names", names)
        }
        return query.resultList.map { mapToMonthStatsDto(it as Array<*>) }
    }


    private fun mapToDayStatsDto(row: Array<*>): ServicesRepairsDayStatsDto {
        return ServicesRepairsDayStatsDto(
            name = row[0] as String,
            date = (row[1] as Date).toLocalDate(),
            revenue = row[2] as Int,
            quantity = row[3] as Int
        )
    }

    private fun mapToMonthStatsDto(row: Array<*>): ServicesRepairsMonthStatsDto {
        return ServicesRepairsMonthStatsDto(
            name = row[0] as String,
            month = row[1] as Int,
            revenue = row[2] as Int,
            quantity = row[3] as Int
        )
    }

}