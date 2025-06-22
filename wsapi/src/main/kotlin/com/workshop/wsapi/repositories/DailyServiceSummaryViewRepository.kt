package com.workshop.wsapi.repositories

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import org.springframework.stereotype.Repository
import java.sql.Date
import java.time.LocalDate

interface ServiceRepairsRevenue {
    val name: String
    val revenue: Int
}

data class ServicesRepairsDayRevenueDto(
    override val name: String,
    val date: LocalDate,
    override val revenue: Int,
) : ServiceRepairsRevenue

data class ServicesRepairsMonthRevenueDto(
    override val name: String,
    val month: Int,
    override val revenue: Int,
) : ServiceRepairsRevenue

@Repository
class DailyServicesRepairsSummaryRepository {

    @PersistenceContext
    private lateinit var entityManager: EntityManager


    fun getRevenuePerDay(startDate: LocalDate, endDate: LocalDate): List<ServicesRepairsDayRevenueDto> {
        val query = entityManager.createNativeQuery(
            """
            SELECT name, date, cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate
            group by name, date 
            order by date
            """
        )
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        return query.resultList.map { mapToDayRevenueDto(it as Array<*>) }
    }

    fun getRevenuePerMonth(startDate: LocalDate, endDate: LocalDate): List<ServicesRepairsMonthRevenueDto> {
        val query = entityManager.createNativeQuery(
            """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate
            group by name, extract(month from date)
            order by extract(month from date)
            """
        )
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)

        return query.resultList.map { mapToMonthRevenueDto(it as Array<*>) }
    }


    fun getRevenuePerDayForCategoryServices(
        startDate: LocalDate,
        endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsDayRevenueDto> {
        var query = entityManager.createNativeQuery("");
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME not like 'Naprawa:%'
            group by name, date 
            order by date
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME not like 'Naprawa:%' AND name in (:names)
            group by name, date 
            order by date
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        query.setParameter("names", names)
        return query.resultList.map { mapToDayRevenueDto(it as Array<*>) }
    }

    fun getRevenuePerDayForCategoryRepairs(
        startDate: LocalDate,
        endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsDayRevenueDto> {
        var query = entityManager.createNativeQuery("");
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME like 'Naprawa:%'
            group by name, date 
            order by date
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND NAME like 'Naprawa:%' AND name in (:names)
            group by name, date 
            order by date
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        query.setParameter("names", names)
        return query.resultList.map { mapToDayRevenueDto(it as Array<*>) }
    }

    fun getRevenuePerDayForCategoryAny(
        startDate: LocalDate,
        endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsDayRevenueDto> {
        var query = entityManager.createNativeQuery("");
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate
            group by name, date 
            order by date
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, date, cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate  AND name in (:names)
            group by name, date 
            order by date
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        query.setParameter("names", names)
        return query.resultList.map { mapToDayRevenueDto(it as Array<*>) }
    }


    fun getRevenuePerMonthForCategoryServices(
        startDate: LocalDate, endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsMonthRevenueDto> {
        var query = entityManager.createNativeQuery("");
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name not like 'Naprawa:%'
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name not like 'Naprawa:%' name in (:names)
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        query.setParameter("names", names)
        return query.resultList.map { mapToMonthRevenueDto(it as Array<*>) }
    }


    fun getRevenuePerMonthForCategoryRepairs(
        startDate: LocalDate, endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsMonthRevenueDto> {
        var query = entityManager.createNativeQuery("");
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name like 'Naprawa:%'
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name like 'Naprawa:%' name in (:names)
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        query.setParameter("names", names)
        return query.resultList.map { mapToMonthRevenueDto(it as Array<*>) }
    }

    fun getRevenuePerMonthForCategoryAny(
        startDate: LocalDate, endDate: LocalDate,
        names: List<String>?
    ): List<ServicesRepairsMonthRevenueDto> {
        var query = entityManager.createNativeQuery("");
        if (names.isNullOrEmpty()) {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate 
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        } else {
            query = entityManager.createNativeQuery(
                """
            SELECT name, cast(extract(month from date) as int), cast(SUM(total_price) as int) FROM daily_services_repairs_summary
            WHERE date >= :startDate AND date < :endDate AND name in (:names)
            group by name, extract(month from date)
            order by extract(month from date)
            """
            )
        }
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        query.setParameter("names", names)
        return query.resultList.map { mapToMonthRevenueDto(it as Array<*>) }
    }


    private fun mapToDayRevenueDto(row: Array<*>): ServicesRepairsDayRevenueDto {
        return ServicesRepairsDayRevenueDto(
            name = row[0] as String,
            date = (row[1] as Date).toLocalDate(),
            revenue = row[2] as Int
        )
    }

    private fun mapToMonthRevenueDto(row: Array<*>): ServicesRepairsMonthRevenueDto {
        return ServicesRepairsMonthRevenueDto(
            name = row[0] as String,
            month = row[1] as Int,
            revenue = row[2] as Int
        )
    }

}