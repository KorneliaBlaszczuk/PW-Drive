package com.workshop.wsapi.services

import com.workshop.wsapi.models.*
import com.workshop.wsapi.repositories.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import com.workshop.wsapi.models.Service as ServiceModel

@Service
class VisitService {

    @Autowired
    private lateinit var metadataRepository: MetadataRepository

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


    @Autowired
    lateinit var repairRepository: RepairRepository

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(VisitService::class.java)
    }

    private fun isTimeSlotReserved(
        date: LocalDate,
        startTime: LocalTime,
        endTime: LocalTime? = null,
        reservedVisits: List<Visit>,
        maxSimultaneousVisits: Int,
    ): Boolean {
        val overlappingVisits = reservedVisits.count { visit ->
            if (visit.date != date) return@count false

            val visitStart = visit.time
            val visitEnd = visit.service?.time?.toMinutes()?.let {
                visitStart.plusMinutes(it)
            }

            if (endTime != null) {
                // Slot for visit without service
                if (visitEnd != null) {
                    // Current checked visit has a service
                    endTime.isAfter(visitStart) && startTime.isBefore(visitEnd)
                } else {
                    // Current checked visit has no service
                    !visitStart.isBefore(startTime) && visitStart.isBefore(endTime)
                }
            } else {
                // Slot for visit with service
                if (visitEnd != null) {
                    // Current checked visit has a service
                    startTime.isAfter(visitStart) && startTime.isBefore(visitEnd)
                } else {
                    // Current checked visit has no service
                    visitStart == startTime
                }
            }

        }

        return overlappingVisits >= maxSimultaneousVisits
    }

    private fun removeAbandonedReservations() {
        val fifteenMinutesAgo = LocalDateTime.now().minusMinutes(15)
        logger.info("Removing abandoned reservations past $fifteenMinutesAgo")
        visitRepository.deleteAbandonedReservations(fifteenMinutesAgo)
    }

    fun addCarRepair(id: Long, userDetails: UserDetails): Repair {
        val oldVisit = visitRepository.findById(id).orElseThrow {
            IllegalArgumentException("Car not found with id $id")

        }

        val newRepair = Repair().apply {
            description = ""
            price = 0
            visit = oldVisit
        }

        return repairRepository.save(newRepair)
    }

    private fun generateAvailableSlotsForService(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        serviceDuration: Long,
        reservedVisits: List<Visit>
    ): List<AvailableSlotDTO> {
        logger.info("Called generateAvailableSlotsForService")
        val slots = mutableListOf<AvailableSlotDTO>()

        val start = startDate.toLocalDate()
        val end = endDate.toLocalDate()

        val openingHours = openingHourRepository.findAll()
        val dayOpeningMap = openingHours.associateBy { it.dayOfWeek }

        val maxSimultaneousVisits =
            metadataRepository.findById(1)
                .orElseThrow { throw NoSuchElementException("No metadata found") }.simultaneousVisits

        var currentDate = start
        while (!currentDate.isAfter(end)) {
            val workingHours = dayOpeningMap[currentDate.dayOfWeek]

            if (workingHours != null && workingHours.isOpen) {
                val openHour = workingHours.openHour
                val closeHour = workingHours.closeHour!!.toLocalTime()

                var currentTime = openHour!!.toLocalTime()

                while (currentTime.plusMinutes(serviceDuration).isBefore(closeHour) ||
                    currentTime.plusMinutes(serviceDuration).equals(closeHour)
                ) {
                    val slotEndTime = currentTime.plusMinutes(serviceDuration)

                    val isSlotAvailable = !isTimeSlotReserved(
                        currentDate,
                        currentTime,
                        slotEndTime,
                        reservedVisits,
                        maxSimultaneousVisits
                    )

                    if (isSlotAvailable) {
                        slots.add(AvailableSlotDTO(date = currentDate, startTime = currentTime, endTime = slotEndTime))
                    }

                    currentTime = currentTime.plusMinutes(serviceDuration)
                }

            }
            currentDate = currentDate.plusDays(1)
        }

        val validSlots = slots.filter {
            when (it.date) {
                start -> {
                    it.startTime.isAfter(startDate.toLocalTime())
                }

                else -> {
                    return@filter true
                }
            }
        }
        return validSlots
    }

    fun isVisitPossible(visit: NoServiceVisitDTO): Boolean {
        val reservedVisits =
            visitRepository.findReservedVisitsBetweenDates(visit.date.atStartOfDay(), visit.date.atTime(23, 59))

        val maxSimultaneousVisits =
            metadataRepository.findById(1)
                .orElseThrow { throw NoSuchElementException("No metadata found") }.simultaneousVisits

        return !isTimeSlotReserved(visit.date, visit.time, null, reservedVisits, maxSimultaneousVisits)

    }

    fun isVisitPossible(visit: ServiceVisitDTO, service: ServiceModel): Boolean {
        val reservedVisits =
            visitRepository.findReservedVisitsBetweenDates(visit.date.atStartOfDay(), visit.date.atTime(23, 59))

        val maxSimultaneousVisits =
            metadataRepository.findById(1)
                .orElseThrow { throw NoSuchElementException("No metadata found") }.simultaneousVisits

        return !isTimeSlotReserved(
            visit.date,
            visit.time,
            visit.time.plusMinutes(service.time.toMinutes()),
            reservedVisits,
            maxSimultaneousVisits
        )

    }

    fun findAvailableSlotsForService(
        startDate: LocalDateTime,
        endDate: LocalDateTime,
        serviceId: Long?
    ): List<AvailableSlotDTO> {
        logger.info("findAvailableSlotsForService startDate: $startDate, endDate: $endDate, serviceId: $serviceId")
        removeAbandonedReservations()

        val reservedVisits = visitRepository.findReservedVisitsBetweenDates(startDate, endDate)

        var serviceDuration: Long = 30  // for visits without service generate slots every 30 minutes
        if (serviceId != null) {
            val service = serviceRepository.findById(serviceId).get()
            serviceDuration = service.time.toMinutes()
        }

        return generateAvailableSlotsForService(startDate, endDate, serviceDuration, reservedVisits)
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
            time = visit.time ?: LocalTime.of(0, 0),
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

    fun getVisitById(id: Long): Visit {
        return visitRepository.findById(id).get()
    }


    fun getVisits(): ResponseEntity<Any> {
        val sort: Sort = Sort.by(Sort.Order.desc("date"), Sort.Order.asc("time"))
        return ResponseEntity.ok().body(visitRepository.findAll(sort))
    }


    fun getUpcomingVisits(days: Int): ResponseEntity<Any> {
        return ResponseEntity.ok().body(visitRepository.getUpcomingVisits(days))
    }

}
