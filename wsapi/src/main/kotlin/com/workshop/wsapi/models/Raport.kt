package com.workshop.wsapi.models

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

class Raport(
    val visit: Visit,
    val repairs: List<Repair>,
    val mileage: HistoryOfChange?,
    val inspectionDate: HistoryOfChange?,
)

data class RaportDto(
    val visit: VisitRaportDto,
    val repairs: List<Repair>,
    val mileage: HistoryDto?,
    val inspectionDate: HistoryDto?
)


data class HistoryDto(
    val id: Long?,
    val changeDate: LocalDateTime,
    val inspectionDate: InspectionDate?,
    val mileage: Mileage?
)

class CarRaportDto(
    val id: Long,
    var name: String,
    var brand: String,
    var nextInspection: LocalDateTime?,
    var model: String,
    var year: Int,
    var mileage: Int
)

data class VisitRaportDto(
    val id: Long,
    val service: Service,
    val car: CarRaportDto,
    val createdAt: String,
    val isReserved: Boolean,
    val time: LocalTime,
    val date: LocalDate,
    val status: String,
    val comment: String?
)