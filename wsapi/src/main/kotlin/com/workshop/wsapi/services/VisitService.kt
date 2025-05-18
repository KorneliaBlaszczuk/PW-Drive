package com.workshop.wsapi.services

import com.workshop.wsapi.models.AvailableSlotDTO
import com.workshop.wsapi.models.Visit
import com.workshop.wsapi.models.VisitDto
import com.workshop.wsapi.repositories.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.sql.Time
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import com.workshop.wsapi.models.Service as ServiceModel

@Service
class VisitService {

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var userService: UserService

    @Autowired
    lateinit var carRepository: CarRepository

    @Autowired
    lateinit var visitRepository: VisitRepository

    @Autowired
    lateinit var serviceRepository: ServiceRepository

    @Autowired
    lateinit var openingHourRepository: OpeningHourRepository

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(VisitService::class.java)
    }

    private fun isTimeSlotReserved(
        date: LocalDate,
        startTime: LocalTime,
        endTime: LocalTime,
        reservedVisits: List<Visit>
    ): Boolean {
        return reservedVisits.any { visit ->
            val sameDay = visit.date.toLocalDate() == date
            if (!sameDay) return@any false

            val existingStart = visit.time.toLocalTime()
            val existingEnd = existingStart.plusMinutes(visit.service?.time?.toMinutes() ?: 30)


            endTime.isAfter(existingStart) && startTime.isBefore(existingEnd)
        }
    }

    private fun removeAbandonedReservations() {
        val fifteenMinutesAgo = LocalDateTime.now().minusMinutes(15)
        logger.info("Removing abandoned reservations past $fifteenMinutesAgo")
        visitRepository.deleteAbandonedReservations(fifteenMinutesAgo)
    }

    private fun generateAvailableSlotsForService(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        service: ServiceModel,
        reservedVisits: List<Visit>
    ): List<AvailableSlotDTO> {
        logger.info("Called generateAvailableSlotsForService")
        val slots = mutableListOf<AvailableSlotDTO>()
        val serviceDuration = service.time?.toMinutes() ?: 30

        val start = startDate.toLocalDate()
        val end = endDate.toLocalDate()

        val openingHours = openingHourRepository.findAll()
        val dayOpeningMap = openingHours.associateBy { it.dayOfWeek }

        var currentDate = start
        while (!currentDate.isAfter(end)) {
            val workingHours = dayOpeningMap[currentDate.dayOfWeek]

            if (workingHours != null && workingHours.isOpen) {
                val openHour = workingHours.openHour
                val closeHour =
                    if (currentDate != end) workingHours.closeHour!!.toLocalTime() else endDate.toLocalTime()

                var currentTime = if (currentDate != start) openHour!!.toLocalTime() else startDate.toLocalTime()

                while (currentTime.plusMinutes(serviceDuration).isBefore(closeHour) ||
                    currentTime.plusMinutes(serviceDuration).equals(closeHour)
                ) {
                    val slotEndTime = currentTime.plusMinutes(serviceDuration)

                    val isSlotAvailable = !isTimeSlotReserved(currentDate, currentTime, slotEndTime, reservedVisits)

                    if (isSlotAvailable) {
                        slots.add(AvailableSlotDTO(date = currentDate, startTime = currentTime, endTime = slotEndTime))
                    }

                    currentTime = currentTime.plusMinutes(serviceDuration)
                }

            }
            currentDate = currentDate.plusDays(1)
        }
        return slots
    }

    fun findAvailableSlotsForService(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        serviceId: Long
    ): List<AvailableSlotDTO> {
        logger.info("findAvailableSlotsForService startDate: $startDate, endDate: $endDate, serviceId: $serviceId")
        removeAbandonedReservations()

        val reservedVisits = visitRepository.findReservedVisitsBetweenDates(startDate, endDate)
        val service = serviceRepository.findById(serviceId).orElseThrow {
            NoSuchElementException("Service is not found")
        }

        return generateAvailableSlotsForService(startDate, endDate, service, reservedVisits)
    }

    fun editVisit(id: Long, visit: VisitDto, userDetails: UserDetails): ResponseEntity<Any> {
        val oldVisit = visitRepository.findById(id).orElseThrow {
            IllegalArgumentException("Visit not found")
        }

        val car = oldVisit.car?.let {
            it.id?.let { it1 ->
                carRepository.findById(it1).orElseThrow {
                    IllegalArgumentException("Car not found")
                }
            }
        }
        val usr = car?.user?.id?.let {
            userRepository.findById(it).orElseThrow {
                IllegalArgumentException("User not found with id ${car.user.id}")
            }
        }
        val serv = visit.serviceId?.let {
            serviceRepository.findById(it).orElseThrow {
                IllegalArgumentException("Service not found")
            }
        }
        if (usr == null || usr.id != userService.getUserByUsername(userDetails.username).id) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("You can only access visits from your own account")
        }

        val newVisit = Visit(
            id = id,
            service = serv,
            car = car,
            isReserved = visit.isReserved,
            time = visit.time ?: Time.valueOf("00:00:00"),
            date = visit.date,
            status = visit.status ?: "PENDING",
            comment = visit.comment
        )
        visitRepository.save(newVisit)
        return ResponseEntity.ok().body(newVisit)
    }

    fun deleteVisit(id: Long): ResponseEntity<Any> {
        return ResponseEntity.ok().body(visitRepository.deleteById(id))
    }

}
